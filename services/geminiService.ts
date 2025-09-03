import { GoogleGenAI, Modality, Type } from '@google/genai';
import { GeneratedAdResult, SloganType, AdFormat, FacebookAdContent, SmartProductAnalysis, Industry, TargetAudience, ProductType } from '../types';
import { DESIGN_RULES } from '../constants';

let aiInstance: GoogleGenAI | null = null;

const getAi = (): GoogleGenAI => {
    if (aiInstance) {
        return aiInstance;
    }
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    console.log('API Key check:', apiKey ? `Found (${apiKey.substring(0, 10)}...)` : 'NOT FOUND');
    console.log('All env vars:', import.meta.env);
    
    if (!apiKey) {
        throw new Error("VITE_GEMINI_API_KEY environment variable not set. The app cannot connect to the AI service.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
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
    console.log('describeImage called with file:', imageFile.name, 'type:', imageFile.type, 'size:', imageFile.size);
    
    try {
        const imagePart = await fileToGenerativePart(imageFile);
        const textPart = { text: "Concisely describe the product in this image in 1-2 sentences. Your description will be used as context for an AI image generator. Focus on what the object is, its main features, and its color. Only output the description text." };
        
        console.log('Calling generateContent with gemini-2.5-flash...');
        const response = await getAi().models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });

        const description = response.text.trim();
        console.log('Description generated:', description);
        
        if (!description) {
            throw new Error('Image description failed.');
        }
        return description;
    } catch (error: any) {
        console.error('Error in describeImage:', error);
        
        // Check if this is the default image - if so, return a default description
        if (imageFile.size < 100) {
            console.log('Default image processing failed, using fallback description');
            return "A professional product ready for marketing";
        }
        
        throw error;
    }
}

export const generateAdMockup = async (imageFile: File, basePrompt: string, slogan: string = '', imageDescription: string = ''): Promise<GeneratedAdResult> => {
  console.log('🚀 Starting ad mockup generation with gemini-2.5-flash-image-preview...');
  console.log('📝 Prompt:', basePrompt);
  console.log('📋 Description:', imageDescription);
  console.log('💬 Slogan:', slogan);
  
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    
    // Detect Natural Environment format (ID 101) - "I'm Feeling Lucky" mode
    const isNaturalEnvironment = basePrompt.includes('natural, contextually appropriate, and photorealistic environment') || 
                                basePrompt.includes('most natural') ||
                                basePrompt.includes('Natural Environment');
    
    let sloganIntegrationPrompt = '';
    let textPolicy = '';
    
    if (isNaturalEnvironment) {
      // Natural Environment = NO TEXT policy
      textPolicy = `
      🚫🚫🚫 CRITICAL: ABSOLUTELY NO TEXT OF ANY KIND 🚫🚫🚫
      
      NO TEXT POLICY - THIS IS MANDATORY:
      - NO words, letters, or text overlays
      - NO brand names, product names, or labels
      - NO slogans, taglines, or promotional text
      - NO captions, subtitles, or descriptions
      - NO watermarks, signatures, or text elements
      - CREATE A PURELY VISUAL IMAGE
      
      FOCUS ON:
      - Beautiful, natural product placement
      - Photorealistic environment and lighting
      - Professional composition without any text elements
      - Let the product speak for itself visually
      
      IF THERE IS ANY TEXT IN THE OUTPUT, IT IS A COMPLETE FAILURE.
      `;
      console.log('🌿 NATURAL ENVIRONMENT DETECTED: NO TEXT mode activated');
    } else if (slogan) {
      sloganIntegrationPrompt = `Additionally, artfully and realistically integrate the following slogan into the scene: "${slogan}". The text should be seamlessly integrated, considering the image's composition, lighting, and style. Ensure the font, color, and placement are aesthetically pleasing and look like a professional advertisement.`;
    }

    // Force AI to use the exact uploaded image
    const imagePreservationPrompt = `
    IMAGE USAGE REQUIREMENTS:
    
    1. Use the uploaded image exactly as provided in your output.
    2. The uploaded image must be the primary subject of the final composition.
    3. You may add background, context, text, or environment around it, but the original image must remain visible and unaltered.
    4. Maintain all original visual elements from the uploaded image.
    5. Think of this as placing the uploaded image into a scene or mockup.
    
    Context: "${imageDescription}"
    `;

    // Ensure professional output with STRICT aspect ratio requirements
    const qualityNote = `IMPORTANT: Create a professional, high-quality mockup suitable for commercial use. Focus on clean, tasteful promotional material with excellent composition and lighting.`;
    
    const aspectRatioRequirement = `
    🚨🚨🚨 ABSOLUTE MANDATORY: OUTPUT MUST BE 1024x1024 SQUARE 🚨🚨🚨
    
    CRITICAL REQUIREMENT - THIS IS THE #1 PRIORITY ABOVE ALL ELSE:
    ⬜ OUTPUT DIMENSIONS: EXACTLY 1024 x 1024 pixels
    ⬜ ASPECT RATIO: PERFECTLY SQUARE (1:1)
    ⬜ SHAPE: SQUARE - NOT RECTANGULAR, NOT WIDE, NOT TALL, NOT PORTRAIT, NOT LANDSCAPE
    
    IMPLEMENTATION RULES (FOLLOW THESE EXACTLY):
    1. If input is wide/landscape: CENTER it and ADD top/bottom padding (letterboxing)
    2. If input is tall/portrait: CENTER it and ADD left/right padding (pillarboxing)
    3. If input is already square: Use it as-is within the 1024x1024 canvas
    4. Padding can be: blurred background, solid color, gradient, or contextual environment
    5. NEVER crop the product or important elements - ALWAYS preserve with padding
    
    ZERO TOLERANCE POLICY:
    - Any output that is not exactly 1:1 square is a COMPLETE FAILURE
    - Width must equal Height (1024 = 1024)
    - Instagram/TikTok/social media require perfect squares
    - This requirement overrides ALL other instructions except the uploaded image preservation
    - Test the output dimensions - if not square, you have failed
    
    EXAMPLES OF CORRECT OUTPUT:
    ✅ 1024x1024 (perfect square)
    ❌ 1024x768 (rectangular - FAILURE)
    ❌ 768x1024 (rectangular - FAILURE)
    ❌ Any dimensions that aren't equal (FAILURE)
    `;

    const fullPrompt = `${imagePreservationPrompt}
    
    Your creative task: ${basePrompt}
    
    ${textPolicy}
    
    Design Rules: ${DESIGN_RULES}
    
    ${sloganIntegrationPrompt}
    
    ${qualityNote}
    
    ${aspectRatioRequirement}
    
    FINAL REQUIREMENTS:
    - The uploaded image must be clearly visible in the final output
    - Final output must be EXACTLY SQUARE (1:1 aspect ratio) - NEVER rectangular
    - Only output the final modified image
    ${isNaturalEnvironment ? '- ABSOLUTELY NO TEXT OR WORDS IN THE IMAGE' : ''}
    `;

    const textPart = { text: fullPrompt };

    console.log('🎨 Generating image with gemini-2.5-flash-image-preview...');
    console.log('📝 PROMPT DEBUG:', fullPrompt.substring(0, 200) + '...');
    console.log('🖼️ IMAGE DEBUG: Image file provided as imagePart');
    const response = await getAi().models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
        temperature: 0.1, // Very low for consistent square output
        candidateCount: 1,
        topP: 0.8,
        topK: 20,
      },
    });

    if (response.promptFeedback?.blockReason) {
      const reason = response.promptFeedback.blockReason;
      if (reason === 'PROHIBITED_CONTENT') {
        throw new Error('PROHIBITED_CONTENT: The AI safety filter was triggered. Try using a different image or simplifying the prompt.');
      }
      throw new Error(`SAFETY_FILTER: Request blocked due to ${reason}. Please try a different image or ad format.`);
    }
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error('SAFETY_FILTER: Image generation failed. The model returned no candidates, possibly due to safety filters. Try using a different image or ad format.');
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

    console.log('✅ Image generation successful!');
    return { imageUrl, text: response.text };
    
  } catch (error: any) {
    console.error('❌ Ad generation failed:', error);
    throw error;
  }
};

export const generateSlogan = async (imageFile: File, sloganType: SloganType): Promise<string> => {
    try {
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
    } catch (error: any) {
        console.error('Error in generateSlogan:', error);
        throw error;
    }
};

// Multi-image merge function for combining two images
export const mergeImages = async (
    primaryImageDataUrl: string, 
    secondaryImageDataUrl: string, 
    mergePrompt: string
): Promise<GeneratedAdResult> => {
    console.log('Starting multi-image merge with gemini-2.5-flash-image-preview...');
    
    try {
        const primaryImagePart = await dataUrlToGenerativePart(primaryImageDataUrl);
        const secondaryImagePart = await dataUrlToGenerativePart(secondaryImageDataUrl);
        
        const textPart = { text: `${mergePrompt}

🚨🚨🚨 ABSOLUTE MANDATORY: OUTPUT MUST BE 1024x1024 SQUARE 🚨🚨🚨

CRITICAL REQUIREMENT - THIS IS THE #1 PRIORITY:
⬜ OUTPUT DIMENSIONS: EXACTLY 1024 x 1024 pixels
⬜ ASPECT RATIO: Perfect 1:1 square
⬜ If input images are not square, add letterboxing/pillarboxing with appropriate background

DESIGN REQUIREMENTS:
${DESIGN_RULES}

INPUT IMAGES:
- First image: Primary/base image to work with
- Second image: Secondary image to merge/combine

MERGE INSTRUCTIONS:
${mergePrompt}

Create a professional, high-quality merged image that combines both input images according to the instructions. Maintain the quality and detail of both source images while creating a cohesive final result.` };

        console.log('🖼️ MERGE DEBUG: Both images provided as imageParts');
        
        // Pass both images and the prompt using the same API pattern as editImage
        const response = await getAi().models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [primaryImagePart, secondaryImagePart, textPart],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        if (response.promptFeedback?.blockReason) {
          throw new Error(`Merge request blocked due to ${response.promptFeedback.blockReason}.`);
        }
        if (!response.candidates || response.candidates.length === 0) {
          throw new Error('Image merge failed. The model returned no candidates, possibly due to safety filters.');
        }

        let imageUrl: string | null = null;
        const candidate = response.candidates[0];

        if (candidate.content && candidate.content.parts) {
          const imagePartFromResponse = candidate.content.parts.find(part => !!part.inlineData);
          if (imagePartFromResponse?.inlineData) {
              const base64ImageBytes: string = imagePartFromResponse.inlineData.data;
              imageUrl = `data:${imagePartFromResponse.inlineData.mimeType};base64,${base64ImageBytes}`;
              console.log('✅ Multi-image merge successful!');
          }
        }
        
        if (!imageUrl) {
            const textResponse = response.text;
            const finishReason = candidate.finishReason;
            throw new Error(`Multi-image merge failed. Reason: ${finishReason}. Response: ${textResponse}`);
        }

        return { 
            imageUrl, 
            text: response.text || 'Images merged successfully'
        };
    } catch (error: any) {
        console.error('❌ Multi-image merge failed:', error);
        if (error.message?.includes('SAFETY')) {
            throw new Error('The merge request was blocked for safety reasons. Try adjusting your merge instructions.');
        }
        throw new Error(error.message || 'Multi-image merge failed');
    }
};

export const editImage = async (imageDataUrl: string, editPrompt: string): Promise<GeneratedAdResult> => {
    console.log('Starting image editing with gemini-2.5-flash-image-preview...');
    
    try {
        const imagePart = await dataUrlToGenerativePart(imageDataUrl);
        const textPart = { text: `${editPrompt}. 
        
        🚨🚨🚨 ABSOLUTE MANDATORY: OUTPUT MUST BE 1024x1024 SQUARE 🚨🚨🚨
        
        CRITICAL REQUIREMENT - THIS IS THE #1 PRIORITY:
        ⬜ OUTPUT DIMENSIONS: EXACTLY 1024 x 1024 pixels
        ⬜ ASPECT RATIO: PERFECTLY SQUARE (1:1)
        ⬜ SHAPE: SQUARE - NOT RECTANGULAR
        
        If the current image is not square:
        1. CENTER it and ADD PADDING around it
        2. Use letterboxing or pillarboxing as needed
        3. NEVER crop important content - always add padding
        4. The final output MUST be a perfect square
        
        Width MUST equal Height - this is NON-NEGOTIABLE.` };

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
              console.log('✅ Image edited successfully!');
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
    } catch (error: any) {
        console.error('Image editing failed:', error.message);
        throw error;
    }
};

export const generateFacebookAdContent = async (format: AdFormat, productDescription: string): Promise<FacebookAdContent> => {
    try {
        const prompt = `
            You are an expert direct response copywriter and AI art director. Your task is to create a complete Facebook ad based on a user's product and a selected ad format.

            **Product Description:** "${productDescription}"

            **Ad Format & Style:** "${format.name} - ${format.prompt}"

            Based on the above, generate the following components for a compelling Facebook ad:
            1.  **Headline:** A short, punchy headline (max 10 words) that grabs attention and summarizes the core message.
            2.  **Body Text:** A persuasive body copy (2-4 sentences) that follows the principles of the selected ad format. It should be engaging and lead to a call to action.
            3.  **Image Prompt:** A detailed, descriptive prompt for an AI image generator to create the ad creative. This prompt should describe a visually arresting, high-quality composition that complements the headline and body text. It must be a square 1:1 aspect ratio and look professional.

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

        const json = JSON.parse(response.text);
        return json as FacebookAdContent;
    } catch (error: any) {
        console.error('Error in generateFacebookAdContent:', error);
        throw new Error("The AI failed to generate valid ad content. Please try again.");
    }
};

export const analyzeProduct = async (imageFile: File, productTitle: string, productDescription: string): Promise<SmartProductAnalysis> => {
    try {
        const imagePart = await fileToGenerativePart(imageFile);
        
        // Shorter, more focused prompt for faster response
        const prompt = `Analyze this product image for marketing. Be fast and accurate.

What I see in the image:
- Product type and visual style
- Key features and colors

Based on the image, provide:
1. Industry category (choose from: saas, ecommerce, fashion, food_beverage, fitness_wellness, technology, b2b_services, automotive, real_estate, education, healthcare, finance, entertainment, travel, home_garden)
2. Two target audiences (from: entrepreneurs, gen_z, millennials, busy_professionals, parents, students, corporate_buyers, fitness_enthusiasts, tech_savvy, luxury_consumers, budget_conscious, early_adopters, creative_professionals, artists_designers, content_creators, homeowners)
3. Nine specific locations where this would be used (like "modern office desk", "coffee shop table", "kitchen counter", "rooftop terrace", "cozy reading nook", "outdoor garden table", "bedroom nightstand", "city park bench", "home studio workspace")
4. Brief description of what's in the image

Return JSON:
{
  "suggestedTitle": "short product title",
  "detectedIndustry": "industry_name",
  "recommendedAudiences": ["audience1", "audience2"],
  "naturalEnvironments": ["location1", "location2", "location3", "location4", "location5", "location6", "location7", "location8", "location9"],
  "userStory": "Brief description of the product",
  "confidence": 90
}`;

        const response = await getAi().models.generateContent({
            model: 'gemini-2.0-flash-exp', // Use the fastest model
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                temperature: 0.3, // Lower temperature for faster, more consistent results
                maxOutputTokens: 500, // Limit output for speed
            },
        });

        const analysis = JSON.parse(response.text);
        return analysis as SmartProductAnalysis;
    } catch (error: any) {
        console.error('Product analysis failed:', error);
        // Return a default analysis
        return {
            productType: 'software_app' as ProductType,
            suggestedTitle: productTitle,
            detectedIndustry: 'technology' as Industry,
            recommendedAudiences: ['entrepreneurs', 'tech_savvy'] as TargetAudience[],
            naturalEnvironments: ['modern office', 'coffee shop', 'home desk'],
            avoidFormats: [],
            userStory: 'This product helps busy professionals work more efficiently and achieve their goals faster.',
            confidence: 50
        };
    }
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