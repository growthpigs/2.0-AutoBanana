
import { GoogleGenAI, Modality, Type } from '@google/genai';
import { GeneratedAdResult, SloganType, AdFormat } from '../types';

let aiInstance: GoogleGenAI | null = null;

const getAi = (): GoogleGenAI => {
    if (aiInstance) {
        return aiInstance;
    }
    if (!process.env.API_KEY) {
        // This error will be caught by the calling function's try/catch block
        throw new Error("API_KEY environment variable not set. The app cannot connect to the AI service.");
    }
    aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return aiInstance;
};


const dataUrlToGenerativePart = async (dataUrl: string) => {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve((reader.result as string).split(',')[1]);
    };
    reader.readAsDataURL(blob);
  });
  const data = await base64EncodedDataPromise;
  return {
    inlineData: {
      data,
      mimeType: blob.type,
    },
  };
};


const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve('');
      }
    };
    reader.readAsDataURL(file);
  });
  const data = await base64EncodedDataPromise;
  return {
    inlineData: {
      data,
      mimeType: file.type,
    },
  };
};

export const describeImage = async (imageFile: File): Promise<string> => {
    const imagePart = await fileToGenerativePart(imageFile);
    const textPart = { text: "Concisely describe the product in this image in 1-2 sentences. Your description will be used as context for an AI image generator. Focus on what the object is, its main features, and its color. Only output the description text." };
    
    const response = await getAi().models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
    });

    const description = response.text.trim();
    if (!description) {
        throw new Error('Image description failed.');
    }
    return description;
}

export const generateAdMockup = async (imageFile: File, basePrompt: string, slogan: string, imageDescription: string): Promise<GeneratedAdResult> => {
  const imagePart = await fileToGenerativePart(imageFile);
  
  let sloganIntegrationPrompt = '';
  if (slogan) {
    sloganIntegrationPrompt = `Additionally, artfully and realistically integrate the following slogan into the scene: "${slogan}". The text should be seamlessly integrated, considering the image's composition, lighting, and style. Ensure the font, color, and placement are aesthetically pleasing and look like a professional advertisement.`;
  }

  const descriptionContext = `The user has provided an image of their product. Here is a description of the product: "${imageDescription}". Use this description as crucial context.`;

  const fullPrompt = `${descriptionContext} Your task is to execute the following creative request: ${basePrompt}. The final output image must be a square 1:1 aspect ratio. ${sloganIntegrationPrompt} Only output the final modified image.`;

  
  const textPart = { text: fullPrompt };

  const response = await getAi().models.generateContent({
    model: 'gemini-2.5-flash-image-preview',
    contents: {
      parts: [imagePart, textPart],
    },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  if (response.promptFeedback?.blockReason) {
    throw new Error(`Request blocked due to ${response.promptFeedback.blockReason}.`);
  }
  if (!response.candidates || response.candidates.length === 0) {
    throw new Error('Image generation failed. The model returned no candidates, possibly due to safety filters.');
  }

  let imageUrl: string | null = null;
  const candidate = response.candidates[0];

  if (candidate.content && candidate.content.parts) {
      const imagePartFromResponse = candidate.content.parts.find(part => !!part.inlineData);
      if (imagePartFromResponse?.inlineData) {
        const base64ImageBytes: string = imagePartFromResponse.inlineData.data;
        imageUrl = `data:${imagePartFromResponse.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
  }

  if (!imageUrl) {
    const textResponse = response.text;
    const finishReason = candidate.finishReason;
    
    let errorMessage = 'Image generation failed. The model did not return an image.';
    if (finishReason && finishReason !== 'STOP') {
        errorMessage += ` Reason: ${finishReason}.`;
    }
    if (textResponse) {
        errorMessage += ` Model response: "${textResponse}"`;
    }
    throw new Error(errorMessage);
  }

  return { imageUrl, text: response.text };
};


export const generateFacebookAdContent = async (format: AdFormat, productDescription: string) => {
    const prompt = `
        You are an expert direct response copywriter and AI art director. Your task is to create a complete Facebook ad based on a user's product and a selected ad format.

        **Product Description:** "${productDescription}"

        **Ad Format & Style:** "${format.name} - ${format.prompt}"

        Based on the above, generate the following components for a compelling Facebook ad:
        1.  **Headline:** A short, punchy headline (max 10 words) that grabs attention and summarizes the core message.
        2.  **Body Text:** A persuasive body copy (2-4 sentences) that follows the principles of the selected ad format. It should be engaging and lead to a call to action.
        3.  **Image Prompt:** A detailed, descriptive prompt for an AI image generator (like Imagen 2) to create the ad creative. This prompt should describe a visually arresting, high-quality photograph that complements the headline and body text. It must be a square 1:1 aspect ratio and look professional.

        Your output MUST be a valid JSON object.
    `;

    const response = await getAi().models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    headline: { type: Type.STRING },
                    bodyText: { type: Type.STRING },
                    imagePrompt: { type: Type.STRING },
                },
                required: ["headline", "bodyText", "imagePrompt"],
            },
        },
    });

    try {
        const json = JSON.parse(response.text);
        return json as { headline: string; bodyText: string; imagePrompt: string };
    } catch (e) {
        console.error("Failed to parse JSON from model:", response.text);
        throw new Error("The AI failed to generate valid ad content. Please try again.");
    }
};

export const editImage = async (imageDataUrl: string, editPrompt: string): Promise<GeneratedAdResult> => {
    const imagePart = await dataUrlToGenerativePart(imageDataUrl);
    const textPart = { text: `${editPrompt}. Ensure the final output image maintains a square 1:1 aspect ratio.` };

    const response = await getAi().models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [imagePart, textPart],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    
    if (response.promptFeedback?.blockReason) {
      throw new Error(`Request blocked due to ${response.promptFeedback.blockReason}.`);
    }
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error('Image editing failed. The model returned no candidates, possibly due to safety filters.');
    }

    let imageUrl: string | null = null;
    const candidate = response.candidates[0];

    if (candidate.content && candidate.content.parts) {
      const imagePartFromResponse = candidate.content.parts.find(part => !!part.inlineData);
      if (imagePartFromResponse?.inlineData) {
          const base64ImageBytes: string = imagePartFromResponse.inlineData.data;
          imageUrl = `data:${imagePartFromResponse.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
    }
    
    if (!imageUrl) {
        const textResponse = response.text;
        const finishReason = candidate.finishReason;
        
        let errorMessage = 'Image editing failed. The model did not return an image.';
        if (finishReason && finishReason !== 'STOP') {
            errorMessage += ` Reason: ${finishReason}.`;
        }
        if (textResponse) {
            errorMessage += ` Model response: "${textResponse}"`;
        }
        throw new Error(errorMessage);
    }

    return { imageUrl, text: response.text };
};

const getSloganPrompt = (sloganType: SloganType): string => {
    switch (sloganType) {
        case 'hook':
            return "Analyze this product image. Brainstorm a short, witty, and modern marketing hook for it. It should be a scroll-stopper, clever, and feel more like a funny observation than a traditional ad tagline. Aim for a casual, conversational tone.";
        case 'meme':
            return "Analyze this product image. Come up with a short, funny meme caption for it. It should be in the style of a popular internet meme. Keep it concise and relatable.";
        case 'joke':
            return "Analyze this product image. Tell a short, clever one-liner joke related to the product or what it does. The joke should be lighthearted and safe for a general audience.";
        case 'quote':
            return "Analyze this product image. Generate a short, inspiring or thought-provoking quote that relates to the feeling or purpose of this product. Make it sound profound but keep it brief.";
        case 'fun_fact':
             return "Analyze this product image. Come up with a surprising and fun fact that is tangentially related to the product, its category, or its use case. Keep it short and interesting.";
        case 'tagline':
            return "Generate a short, professional, and catchy tagline for this product. Suitable for a corporate or business context."
        default:
            return "Generate a short, catchy tagline for this product.";
    }
}

export const generateSlogan = async (imageFile: File, sloganType: SloganType): Promise<string> => {
    const imagePart = await fileToGenerativePart(imageFile);
    const basePrompt = getSloganPrompt(sloganType);
    const textPart = { text: `${basePrompt} The output should be only the slogan text itself, without any quotation marks or extra explanations.` };

    const response = await getAi().models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
    });
    
    const slogan = response.text.trim();
    if (!slogan) {
        throw new Error('Slogan generation failed. The model did not return any text.');
    }
    
    return slogan.replace(/^"|"$|^\*|\*$/g, '').trim();
};
