
import React, { useState, useCallback, useEffect } from 'react';
import { AdFormat, SloganType, UploadedImage, FacebookAdContent, GeneratedContent, MockupContent } from './types';
import { generateAdMockup, generateSlogan, editImage, describeImage, generateFacebookAdContent } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { Workspace } from './components/Workspace';

export type LoadingState = 'idle' | 'describing' | 'generating_text' | 'generating_image' | 'editing';

export interface LastGenerationParams {
    format: AdFormat;
    sloganType: SloganType | null;
    slogan: string;
    description: string;
    selectedImage: UploadedImage;
}

// Correctly encoded default image from the provided URL.
const defaultImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gAAAPoCAYAAABNo9TkAAAAAXNSR0IArs4c6QAAAIRlWElmTU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAACQAAAAAQAAAJAAAAABAAKgAgAEAAAAAQAAA+igAwAEAAAAAQAAA+gAAAAA06o2bQAAIABJREFUeJzsvQl4XNWZ/3/P1Jk5M5Pdk2xyk2ySLbIlS7Is27IdN4BtxoFhYGA42ADgOAbgPGACh/GAYeAEY8BsnNgxLNmyLcvSJHSTbHJzk5m5J1Pz7/G8r9apmlvdm5ps3u/35Z2qutvVp27d9P7uPffc/2AgAAAAgAAAAEBLxX+uAwAAAACAJgpGAAAAAEAgGDGg5uPjM3LkyO+uAyQAoFLt2rXfXQd44iN48/FxdPjw4RkZGRk/n3vuuYfVd3fDCRkBAAAAAGCAjAAAAAAQCAYMGQAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAAAgEAwYMgAAAA-";

// FIX: Removed invalid text nodes and implemented the full App component.
export const App: React.FC = () => {
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);
    const [imageDescription, setImageDescription] = useState('');
    const [loadingState, setLoadingState] = useState<LoadingState>('idle');
    const [isDescriptionLoading, setIsDescriptionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isRepositionMode, setIsRepositionMode] = useState(false);
    const [history, setHistory] = useState<(GeneratedContent | null)[]>([]);
    const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
    const [sessionGallery, setSessionGallery] = useState<GeneratedContent[]>([]);
    const [lastGenerationParams, setLastGenerationParams] = useState<LastGenerationParams | null>(null);
    
    const generatedContent = history[currentHistoryIndex] ?? null;
    const isContentGenerated = generatedContent !== null;
    const isLoading = loadingState !== 'idle';
    const canUndo = currentHistoryIndex > 0;
    const canRedo = currentHistoryIndex < history.length - 1;

    // Default image setup
    useEffect(() => {
        const init = async () => {
            const response = await fetch(defaultImageBase64);
            const blob = await response.blob();
            const file = new File([blob], "default_product.png", { type: "image/png" });
            const defaultImage: UploadedImage = {
                id: 'default-0',
                file: file,
                previewUrl: defaultImageBase64
            };
            setUploadedImages([defaultImage]);
            setSelectedImage(defaultImage);
        };
        init().catch(console.error);
    }, []);

    const updateHistory = (newContent: GeneratedContent | null) => {
        const newHistory = history.slice(0, currentHistoryIndex + 1);
        newHistory.push(newContent);
        setHistory(newHistory);
        setCurrentHistoryIndex(newHistory.length - 1);
    };

    const handleImageUpload = useCallback((file: File, previewUrl: string) => {
        const newImage: UploadedImage = {
            id: `${file.name}-${new Date().getTime()}`,
            file,
            previewUrl,
        };
        setUploadedImages(prev => [newImage, ...prev]);
        setSelectedImage(newImage);
        setHistory([]);
        setCurrentHistoryIndex(-1);
        setError(null);
        setSessionGallery([]);
        setLastGenerationParams(null);
    }, []);

    const handleGenerateDescription = useCallback(async () => {
        if (!selectedImage) return;
        setIsDescriptionLoading(true);
        setError(null);
        try {
            const desc = await describeImage(selectedImage.file);
            setImageDescription(desc);
        } catch (e: any) {
            setError(e.message || 'Failed to generate description.');
        } finally {
            setIsDescriptionLoading(false);
        }
    }, [selectedImage]);

    useEffect(() => {
        if (selectedImage) {
            handleGenerateDescription();
        }
    }, [selectedImage, handleGenerateDescription]);

    const handleGenerate = useCallback(async (format: AdFormat, sloganType: SloganType | null) => {
        if (!selectedImage || !imageDescription) {
            setError("Please upload an image and provide a description first.");
            return;
        }

        setError(null);
        const isImageTask = format.type === 'mockup' || format.type === 'social' || format.type === 'facebook';
        setLoadingState(isImageTask ? 'generating_image' : 'generating_text');

        try {
            let slogan = '';
            if (sloganType) {
                setLoadingState('generating_text');
                slogan = await generateSlogan(selectedImage.file, sloganType);
            }
            
            setLastGenerationParams({ format, sloganType, slogan, description: imageDescription, selectedImage });

            if (format.type === 'mockup' || format.type === 'social') {
                setLoadingState('generating_image');
                const result = await generateAdMockup(selectedImage.file, format.prompt, slogan, imageDescription);
                if (!result.imageUrl) throw new Error("Image generation failed to return an image URL.");
                const newContent: MockupContent = { imageUrl: result.imageUrl, slogan };
                updateHistory(newContent);
                setSessionGallery(prev => [newContent, ...prev].slice(0, 16));
            } else if (format.type === 'facebook') {
                setLoadingState('generating_text');
                const fbContent = await generateFacebookAdContent(format, imageDescription);
                setLoadingState('generating_image');
                
                // For Facebook, we generate a new image based on the prompt, but also featuring the product
                const result = await generateAdMockup(selectedImage.file, fbContent.imagePrompt, '', imageDescription);
                if (!result.imageUrl) throw new Error("Facebook Ad image generation failed to return an image URL.");

                const newContent: FacebookAdContent = {
                    imageUrl: result.imageUrl,
                    headline: fbContent.headline,
                    bodyText: fbContent.bodyText,
                };
                updateHistory(newContent);
                setSessionGallery(prev => [newContent, ...prev].slice(0, 16));
            }

        } catch (e: any) {
            console.error("Generation failed:", e);
            setError(e.message || 'An unknown error occurred during generation.');
            updateHistory(null); // Add a null entry to history to represent the failed state
        } finally {
            setLoadingState('idle');
        }
    }, [selectedImage, imageDescription, history, currentHistoryIndex]);

    const handleEdit = useCallback(async (editPrompt: string) => {
        const currentContent = history[currentHistoryIndex];
        if (!currentContent || !currentContent.imageUrl) return;
        
        setError(null);
        setLoadingState('editing');
        try {
            const result = await editImage(currentContent.imageUrl, editPrompt);
            if (!result.imageUrl) throw new Error("Image editing failed to return an image URL.");
            // Preserve other properties of the content object
            const newContent: GeneratedContent = { ...currentContent, imageUrl: result.imageUrl };
            updateHistory(newContent);
        } catch (e: any) {
            setError(e.message || 'Failed to edit image.');
        } finally {
            setLoadingState('idle');
        }
    }, [currentHistoryIndex, history]);
    
    const handleRegenerateImage = useCallback(async () => {
        if (!lastGenerationParams) return;
        const { format, slogan, description, selectedImage } = lastGenerationParams;
        
        setError(null);
        setLoadingState('generating_image');
        try {
            const result = await generateAdMockup(selectedImage.file, format.prompt, slogan, description);
            if (!result.imageUrl) throw new Error("Image regeneration failed.");
            
            const newContent: MockupContent = { imageUrl: result.imageUrl, slogan };
            updateHistory(newContent);
            setSessionGallery(prev => [newContent, ...prev].slice(0, 16));

        } catch (e: any) {
            setError(e.message || 'Failed to regenerate image.');
            updateHistory(null);
        } finally {
            setLoadingState('idle');
        }
    }, [lastGenerationParams]);
    
    const handleRegenerateText = useCallback(async () => {
        if (!lastGenerationParams || !lastGenerationParams.sloganType || !generatedContent) return;
        const { format, sloganType, description, selectedImage } = lastGenerationParams;

        setError(null);
        setLoadingState('generating_text');
        try {
            const newSlogan = await generateSlogan(selectedImage.file, sloganType);
            setLastGenerationParams(prev => prev ? { ...prev, slogan: newSlogan } : null);
            setLoadingState('generating_image');
            const result = await generateAdMockup(selectedImage.file, format.prompt, newSlogan, description);
            if (!result.imageUrl) throw new Error("Image regeneration after text regeneration failed.");

            const newContent: MockupContent = { imageUrl: result.imageUrl, slogan: newSlogan };
            updateHistory(newContent);
            setSessionGallery(prev => [newContent, ...prev].slice(0, 16));
        } catch (e: any) {
            setError(e.message || 'Failed to regenerate text and image.');
            updateHistory(null);
        } finally {
            setLoadingState('idle');
        }
    }, [lastGenerationParams, generatedContent]);

    const handleNewVariation = useCallback(async () => {
        if (!lastGenerationParams) return;
        await handleGenerate(lastGenerationParams.format, lastGenerationParams.sloganType);
    }, [lastGenerationParams, handleGenerate]);

    const handleFacebookAdTextChange = (newContent: Partial<FacebookAdContent>) => {
        if (generatedContent && 'headline' in generatedContent) {
            const updatedContent = { ...generatedContent, ...newContent };
            const newHistory = [...history];
            newHistory[currentHistoryIndex] = updatedContent;
            setHistory(newHistory);
        }
    };
    
    const handleUndo = () => canUndo && setCurrentHistoryIndex(currentHistoryIndex - 1);
    const handleRedo = () => canRedo && setCurrentHistoryIndex(currentHistoryIndex + 1);
    const handleReset = () => {
        if (history.length > 0 && currentHistoryIndex > 0) {
            const firstState = history[0];
            setHistory([firstState]);
            setCurrentHistoryIndex(0);
        }
    };

    const handleUploadNew = () => {
        setSelectedImage(null);
        setImageDescription('');
        setHistory([]);
        setCurrentHistoryIndex(-1);
        setError(null);
        setSessionGallery([]);
        setLastGenerationParams(null);
    };

    const handleSelectFromLibrary = (image: UploadedImage) => {
        if (image.id !== selectedImage?.id) {
            setSelectedImage(image);
            setHistory([]);
            setCurrentHistoryIndex(-1);
            setError(null);
            setSessionGallery([]);
            setLastGenerationParams(null);
        }
    };
    
    const handleSelectFromGallery = (content: GeneratedContent) => {
        updateHistory(content);
    };

    const handleToggleRepositionMode = () => setIsRepositionMode(prev => !prev);
    const handleRepositionClick = (x: number, y: number) => {
        const prompt = `Keeping everything else the same, move the main text or slogan to be centered around the click coordinates (${x.toFixed(2)}, ${y.toFixed(2)}), where (0,0) is the top-left corner and (1,1) is the bottom-right corner of the image. The product placement should not change.`;
        handleEdit(prompt);
        setIsRepositionMode(false);
    };


    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
            <Header />
            <main className="flex-grow container mx-auto px-4 md:px-8 py-8 w-full max-w-screen-2xl">
                {!selectedImage ? (
                    <div className="max-w-xl mx-auto mt-16">
                        <ImageUploader onImageUpload={handleImageUpload} />
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8 h-full">
                        <Sidebar
                            imageLibrary={uploadedImages}
                            selectedImage={selectedImage}
                            onSelectFromLibrary={handleSelectFromLibrary}
                            onGenerate={handleGenerate}
                            isLoading={isLoading}
                            isImageGenerated={isContentGenerated}
                            imageDescription={imageDescription}
                            onDescriptionChange={setImageDescription}
                            isDescriptionLoading={isDescriptionLoading}
                            onImageUpload={handleImageUpload}
                            onGenerateDescription={handleGenerateDescription}
                        />
                        <div className="flex-1 min-w-0">
                            <Workspace
                                loadingState={loadingState}
                                generatedContent={generatedContent}
                                error={error}
                                onEdit={handleEdit}
                                onUndo={handleUndo}
                                onRedo={handleRedo}
                                onReset={handleReset}
                                onUploadNew={handleUploadNew}
                                canUndo={canUndo}
                                canRedo={canRedo}
                                isContentGenerated={isContentGenerated}
                                isLoading={isLoading}
                                isRepositionMode={isRepositionMode}
                                onToggleRepositionMode={handleToggleRepositionMode}
                                onRepositionClick={handleRepositionClick}
                                onRegenerateImage={handleRegenerateImage}
                                onRegenerateText={handleRegenerateText}
                                onNewVariation={handleNewVariation}
                                sessionGallery={sessionGallery}
                                onSelectFromGallery={handleSelectFromGallery}
                                onFacebookAdTextChange={handleFacebookAdTextChange}
                                lastGenerationParams={lastGenerationParams}
                            />
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};
