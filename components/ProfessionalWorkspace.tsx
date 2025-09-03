import React, { useState, useRef } from 'react';
import { GeneratedContent, FacebookAdContent } from '../types';
import { Download, Share2, Sparkles, Type, Image, Plus, ChevronDown, Send } from 'lucide-react';
import { LastGenerationParams } from '../App';
import { ImageMergeModal } from './ImageMergeModal';

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
  onImageMerge?: (file: File, previewUrl: string, mergeType: string, customInstructions: string) => void;
  lastGenerationParams?: LastGenerationParams | null;
  imageLibrary?: any[];
  onSelectFromLibrary?: (image: any) => void;
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
  onImageMerge?: (file: File, previewUrl: string, mergeType: string, customInstructions: string) => void;
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
  onImageMerge,
  lastGenerationParams,
  isLoading = false
}) => {
  const [chatInput, setChatInput] = useState('');
  const [showMergeModal, setShowMergeModal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Row 2: Global Editing Toolbar - Full width across entire workspace */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Editing Tools */}
          <div className="flex items-center gap-4">
            <button
              onClick={onNewVariation}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="New Variation"
            >
              <Sparkles className="w-4 h-4" />
              <span>Variation</span>
            </button>
            
            <button
              onClick={onRegenerateText}
              disabled={isLoading || !lastGenerationParams}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="New Text"
            >
              <Type className="w-4 h-4" />
              <span>Text</span>
            </button>
            
            <button
              onClick={() => setShowMergeModal(true)}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Blend Images"
            >
              <Image className="w-4 h-4" />
              <span>Blend Images</span>
            </button>
          </div>

          {/* Right: Chat Input + Export */}
          <div className="flex items-center gap-4">
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
                className="w-80 px-4 pr-12 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !chatInput.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-500 hover:text-yellow-600 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
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

      {/* Canvas Area - Clean, centered image display */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="relative bg-white rounded-lg shadow-lg overflow-hidden" style={{ maxWidth: '600px', maxHeight: '600px' }}>
          <img
            src={content.imageUrl}
            alt="Generated content"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Image Merge Modal */}
      <ImageMergeModal
        isOpen={showMergeModal}
        onClose={() => setShowMergeModal(false)}
        onMerge={(file, previewUrl, mergeType, customInstructions) => {
          // Use the new multi-image merge handler instead of text-only approach
          if (onImageMerge) {
            onImageMerge(file, previewUrl, mergeType, customInstructions);
          } else {
            console.error('onImageMerge handler not available');
          }
        }}
      />
    </div>
  );
};

const ProjectGallery: React.FC<{
  sessionGallery: GeneratedContent[];
  onSelectFromGallery: (content: GeneratedContent) => void;
  currentContent: GeneratedContent | null;
  imageLibrary?: any[]; // Add imageLibrary prop
  onSelectFromLibrary?: (image: any) => void; // Add handler
}> = ({ sessionGallery, onSelectFromGallery, currentContent, imageLibrary = [], onSelectFromLibrary }) => {
  const [activeTab, setActiveTab] = useState<'generations' | 'uploads'>('generations');

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('uploads')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'uploads' 
                ? 'border-yellow-400 text-gray-900 bg-yellow-50' 
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Uploads ({imageLibrary.length})
          </button>
          <button
            onClick={() => setActiveTab('generations')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'generations' 
                ? 'border-yellow-400 text-gray-900 bg-yellow-50' 
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Generations ({sessionGallery.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'uploads' && (
          <div>
            {imageLibrary.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No uploads yet</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {imageLibrary.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => onSelectFromLibrary?.(image)}
                    className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-all"
                  >
                    <img
                      src={image.previewUrl}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'generations' && (
          <div>
            {sessionGallery.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No generations yet</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {sessionGallery.slice(0, 12).map((item, index) => (
                  <button
                    key={index}
                    onClick={() => onSelectFromGallery(item)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
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
            )}
          </div>
        )}
      </div>
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
  onImageMerge,
  lastGenerationParams,
  imageLibrary,
  onSelectFromLibrary
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
        onImageMerge={onImageMerge}
        lastGenerationParams={lastGenerationParams}
        isLoading={isLoading}
      />
      <ProjectGallery
        sessionGallery={sessionGallery}
        onSelectFromGallery={onSelectFromGallery}
        currentContent={content}
        imageLibrary={imageLibrary}
        onSelectFromLibrary={onSelectFromLibrary}
      />
    </div>
  );
};