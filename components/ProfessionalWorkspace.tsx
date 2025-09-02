import React, { useState, useRef } from 'react';
import { GeneratedContent, FacebookAdContent } from '../types';
import { Download, Share2, Sparkles, Type, Image, Plus, ChevronDown, Send } from 'lucide-react';
import { LastGenerationParams } from '../App';

interface ProfessionalWorkspaceProps {
  content: GeneratedContent | null;
  isLoading: boolean;
  onEditPrompt: (prompt: string) => void;
  onRegenerateImage: () => void;
  onRegenerateText: () => void;
  onNewVariation: () => void;
  sessionGallery: GeneratedContent[];
  onSelectFromGallery: (content: GeneratedContent) => void;
  onFacebookAdTextChange: (newContent: Partial<FacebookAdContent>) => void;
  onImageUpload: (file: File, previewUrl: string) => void;
  lastGenerationParams?: LastGenerationParams | null;
}

const EmptyState: React.FC<{ onImageUpload: (file: File, previewUrl: string) => void }> = ({ onImageUpload }) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onImageUpload(imageFile, reader.result);
        }
      };
      reader.readAsDataURL(imageFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div 
        className="w-full max-w-md text-center border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-gray-400 transition-colors"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-2xl">🍌</span>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Creating</h3>
        <p className="text-gray-600 mb-6">
          Upload a product image to generate professional ads with AI
        </p>
        
        <label className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          Upload Image
        </label>
        
        <p className="text-xs text-gray-500 mt-4">
          Drag and drop an image here or click to browse
        </p>
      </div>
    </div>
  );
};

const CreativeCanvas: React.FC<{ 
  content: GeneratedContent;
  onEditPrompt: (prompt: string) => void;
  onFacebookAdTextChange?: (newContent: Partial<FacebookAdContent>) => void;
  onRegenerateImage?: () => void;
  onRegenerateText?: () => void;
  onNewVariation?: () => void;
  onImageUpload?: (file: File, previewUrl: string) => void;
  lastGenerationParams?: LastGenerationParams | null;
  isLoading?: boolean;
}> = ({ 
  content, 
  onEditPrompt, 
  onFacebookAdTextChange,
  onRegenerateImage,
  onRegenerateText,
  onNewVariation,
  onImageUpload,
  lastGenerationParams,
  isLoading = false
}) => {
  const [chatInput, setChatInput] = useState('');
  const [showImageMenu, setShowImageMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Canvas Toolbar - Single row with tools and chat inline */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-1">
          {/* Editing Tools - Compact */}
          <button
            onClick={onNewVariation}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="New Variation"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Variation</span>
          </button>
          
          <button
            onClick={onRegenerateText}
            disabled={isLoading || !lastGenerationParams}
            className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="New Text"
          >
            <Type className="w-3.5 h-3.5" />
            <span>Text</span>
          </button>
          
          <button
            onClick={onRegenerateImage}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="New Image"
          >
            <Image className="w-3.5 h-3.5" />
            <span>Image</span>
          </button>

          {/* Add Image Dropdown - Compact */}
          <div className="relative">
            <button
              onClick={() => setShowImageMenu(!showImageMenu)}
              disabled={isLoading}
              className="flex items-center gap-1 px-2 py-1.5 text-xs text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
              <ChevronDown className="w-2.5 h-2.5" />
            </button>
            
            {showImageMenu && (
              <div className="absolute left-0 top-full mt-1 w-36 bg-white border border-gray-200/80 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setShowImageMenu(false);
                    onEditPrompt('Merge the uploaded image with the current image, blending them naturally');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
                >
                  Merge Images
                </button>
                <button
                  onClick={() => {
                    setShowImageMenu(false);
                    onEditPrompt('Replace the main product with the new uploaded image while keeping the same style');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
                >
                  Swap Product
                </button>
                <button
                  onClick={() => {
                    setShowImageMenu(false);
                    onEditPrompt('Overlay the new image on top of the current image as a layer');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
                >
                  Overlay Image
                </button>
                <div className="border-t border-gray-200/80" />
                <button
                  onClick={() => {
                    setShowImageMenu(false);
                    fileInputRef.current?.click();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
                >
                  Upload New
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Chat Input - Inline on the right */}
        <div className="flex-1 max-w-lg mx-4">
          <form onSubmit={(e) => {
            e.preventDefault();
            if (chatInput.trim() && !isLoading) {
              onEditPrompt(chatInput);
              setChatInput('');
            }
          }} className="relative">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Describe changes (e.g., 'make it brighter', 'add sunset background')"
              className="w-full px-3 pr-10 py-1.5 text-sm border border-gray-300/80 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
              style={{ backgroundColor: '#fafafa' }}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !chatInput.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-yellow-600 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && onImageUpload) {
            const reader = new FileReader();
            reader.onloadend = () => {
              if (typeof reader.result === 'string') {
                onImageUpload(file, reader.result);
              }
            };
            reader.readAsDataURL(file);
          }
        }}
        className="hidden"
      />

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="relative bg-white rounded-lg shadow-lg overflow-hidden" style={{ maxWidth: '600px', maxHeight: '600px' }}>
          <img
            src={content.imageUrl}
            alt="Generated content"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

const ProjectGallery: React.FC<{
  sessionGallery: GeneratedContent[];
  onSelectFromGallery: (content: GeneratedContent) => void;
  currentContent: GeneratedContent | null;
}> = ({ sessionGallery, onSelectFromGallery, currentContent }) => {
  if (sessionGallery.length === 0) return null;

  return (
    <div className="w-64 bg-white border-l border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-4">Recent Generations</h3>
      <div className="space-y-3">
        {sessionGallery.slice(0, 8).map((item, index) => (
          <button
            key={index}
            onClick={() => onSelectFromGallery(item)}
            className={`w-full aspect-square rounded-lg overflow-hidden border-2 transition-all ${
              currentContent?.imageUrl === item.imageUrl
                ? 'border-yellow-400 ring-2 ring-yellow-100'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <img
              src={item.imageUrl}
              alt={`Generation ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
      
      {sessionGallery.length > 8 && (
        <button className="w-full mt-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-md hover:bg-gray-50">
          View All ({sessionGallery.length})
        </button>
      )}
    </div>
  );
};

export const ProfessionalWorkspace: React.FC<ProfessionalWorkspaceProps> = ({
  content,
  isLoading,
  onEditPrompt,
  onRegenerateImage,
  onRegenerateText,
  onNewVariation,
  sessionGallery,
  onSelectFromGallery,
  onFacebookAdTextChange,
  onImageUpload,
  lastGenerationParams
}) => {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-gray-200 border-t-yellow-400 rounded-full animate-spin"></div>
          <p className="text-gray-600">Generating your content...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return <EmptyState onImageUpload={onImageUpload} />;
  }

  return (
    <div className="flex-1 flex">
      <CreativeCanvas 
        content={content}
        onEditPrompt={onEditPrompt}
        onFacebookAdTextChange={onFacebookAdTextChange}
        onRegenerateImage={onRegenerateImage}
        onRegenerateText={onRegenerateText}
        onNewVariation={onNewVariation}
        onImageUpload={onImageUpload}
        lastGenerationParams={lastGenerationParams}
        isLoading={isLoading}
      />
      <ProjectGallery
        sessionGallery={sessionGallery}
        onSelectFromGallery={onSelectFromGallery}
        currentContent={content}
      />
    </div>
  );
};