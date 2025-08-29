import React, { useState } from 'react';
import { AdFormat, SloganType, UploadedImage, FormatType } from '../types';
import { AD_FORMATS, SOCIAL_MEDIA_FORMATS, FACEBOOK_AD_FORMATS } from '../constants';
import { PlusIcon, SparklesIcon } from './Icons';

interface SidebarProps {
  imageLibrary: UploadedImage[];
  selectedImage: UploadedImage;
  onSelectFromLibrary: (image: UploadedImage) => void;
  onGenerate: (format: AdFormat, sloganType: SloganType | null) => void;
  isLoading: boolean;
  isImageGenerated: boolean;
  imageDescription: string;
  onDescriptionChange: (description: string) => void;
  isDescriptionLoading: boolean;
  onImageUpload: (file: File, previewUrl: string) => void;
  onGenerateDescription: () => void;
}

const TABS: { name: string, type: FormatType }[] = [
    { name: 'Mockups', type: 'mockup' },
    { name: 'Social Posts', type: 'social' },
    { name: 'Facebook Ads', type: 'facebook' },
];
const MAX_DESC_LENGTH = 800;

const DescriptionLoader: React.FC = () => (
    <div className="space-y-2 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-16 bg-gray-200 rounded-md"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4 ml-auto"></div>
    </div>
);

export const Sidebar: React.FC<SidebarProps> = ({
  imageLibrary,
  selectedImage,
  onSelectFromLibrary,
  onGenerate,
  isLoading,
  isImageGenerated,
  imageDescription,
  onDescriptionChange,
  isDescriptionLoading,
  onImageUpload,
  onGenerateDescription,
}) => {
    const [activeTab, setActiveTab] = useState(0);
    const [selectedFormat, setSelectedFormat] = useState<AdFormat | null>(null);
    const [selectedSloganType, setSelectedSloganType] = useState<SloganType | null>(null);

    const handleGenerateClick = () => {
        if (selectedFormat) {
            onGenerate(selectedFormat, selectedSloganType);
        }
    };

    const handleFormatSelect = (format: AdFormat) => {
        setSelectedFormat(format);
        onGenerate(format, selectedSloganType);
    };
    
    const sloganTypes: { id: SloganType; name: string }[] = [
        { id: 'hook', name: 'Hook' },
        { id: 'tagline', name: 'Tagline' },
        { id: 'meme', name: 'Meme Text' },
        { id: 'joke', name: 'Joke' },
        { id: 'quote', name: 'Quote' },
        { id: 'fun_fact', name: 'Fun Fact' },
    ];
    
    const getFormatsForTab = (tabIndex: number) => {
        switch (TABS[tabIndex].type) {
            case 'mockup': return AD_FORMATS;
            case 'social': return SOCIAL_MEDIA_FORMATS;
            case 'facebook': return FACEBOOK_AD_FORMATS;
            default: return [];
        }
    }
    const currentFormats = getFormatsForTab(activeTab);

    const handleFile = (file: File | undefined) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    onImageUpload(file, reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleFile(event.target.files?.[0]);
    };

    return (
        <aside className="w-96 bg-white/80 backdrop-blur-lg border-r border-gray-200 p-6 flex flex-col space-y-6 overflow-y-auto">
            {/* Image Library */}
            <div className="space-y-3">
                <h2 className="text-lg font-bold text-gray-800">Image Library</h2>
                <div className="grid grid-cols-4 gap-2">
                    <label 
                        htmlFor="sidebar-file-upload"
                        className="aspect-square bg-gray-100 rounded-md flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-indigo-500 hover:bg-gray-50 transition-colors"
                        aria-label="Upload new image"
                    >
                        <PlusIcon className="w-6 h-6 text-gray-400" />
                        <input
                            id="sidebar-file-upload"
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/png, image/jpeg, image/webp"
                            disabled={isLoading}
                        />
                    </label>
                    {imageLibrary.map(image => (
                        <button 
                            key={image.id}
                            onClick={() => onSelectFromLibrary(image)}
                            className={`aspect-square bg-gray-100 rounded-md overflow-hidden border-2 transition-colors ${selectedImage.id === image.id ? 'border-indigo-500' : 'border-transparent hover:border-gray-300'}`}
                            aria-label="Select product image"
                        >
                            <img src={image.previewUrl} alt="Product preview" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="border-t border-gray-200 -mx-6"></div>

            {/* Product Description */}
             <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800">Product Description</h2>
                    <button
                        onClick={onGenerateDescription}
                        disabled={isDescriptionLoading || isLoading}
                        className="flex items-center gap-1.5 py-1 px-2 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 disabled:opacity-50 transition-colors"
                    >
                        <SparklesIcon className="w-3 h-3" />
                        Generate with AI
                    </button>
                </div>
                {isDescriptionLoading ? <DescriptionLoader /> : (
                    <>
                        <p className="text-xs text-gray-500">The AI's understanding of your product. Edit it for better results.</p>
                        <textarea
                            value={imageDescription}
                            onChange={(e) => onDescriptionChange(e.target.value)}
                            rows={4}
                            maxLength={MAX_DESC_LENGTH}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Describe your product here..."
                            disabled={isLoading}
                        />
                        <p className="text-right text-xs text-gray-400">
                            {imageDescription.length} / {MAX_DESC_LENGTH}
                        </p>
                    </>
                )}
            </div>

            <div className="border-t border-gray-200 -mx-6"></div>

            {/* Content Tabs */}
            <div>
                <div className="border-b border-gray-200 mb-4">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        {TABS.map((tab, index) => (
                            <button
                                key={tab.name}
                                onClick={() => {
                                    setActiveTab(index);
                                    setSelectedFormat(null);
                                }}
                                className={`${
                                    activeTab === index
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {currentFormats.map((format) => (
                        <button
                          key={format.id}
                          onClick={() => handleFormatSelect(format)}
                          disabled={isLoading}
                          className={`group flex flex-col items-center justify-center p-2 text-center rounded-md aspect-square transition-all
                            ${isLoading ? 'cursor-not-allowed bg-gray-100 text-gray-400' : 'ring-1 ring-gray-200'}
                            ${selectedFormat?.id === format.id ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'bg-white hover:bg-indigo-50'}
                          `}
                          aria-label={`Select ${format.name} format`}
                        >
                          <format.icon className={`w-6 h-6 mb-1.5 transition-colors ${selectedFormat?.id === format.id ? 'text-indigo-600' : 'text-gray-500 group-hover:text-indigo-600'}`} />
                          <span className={`text-xs font-medium transition-colors ${selectedFormat?.id === format.id ? 'text-indigo-700' : 'text-gray-600 group-hover:text-indigo-700'}`}>{format.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {TABS[activeTab].type !== 'facebook' && (
                <>
                <div className="border-t border-gray-200 -mx-6"></div>
                {/* Slogan Style */}
                <div className="space-y-3">
                    <h2 className="text-lg font-bold text-gray-800">Slogan Style</h2>
                    <p className="text-xs text-gray-500">Optional. Select a style for an AI-generated slogan to be added.</p>
                    <div className="grid grid-cols-3 gap-2">
                        {sloganTypes.map(type => (
                            <button
                                key={type.id}
                                onClick={() => setSelectedSloganType(current => current === type.id ? null : type.id)}
                                disabled={isLoading}
                                className={`py-2 px-1 text-xs font-semibold rounded-md transition-colors border ${
                                    selectedSloganType === type.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                } ${isLoading ? 'opacity-50' : ''}`}
                            >
                                {type.name}
                            </button>
                        ))}
                    </div>
                </div>
                </>
            )}
            
            <button 
                onClick={handleGenerateClick}
                disabled={isLoading || !selectedFormat}
                className="w-full mt-auto text-center py-2.5 px-4 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Generating...' : 'Generate Mockup'}
            </button>
        </aside>
    );
};