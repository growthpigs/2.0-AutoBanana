import React, { useState } from 'react';
import { GeneratedContent, FacebookAdContent } from '../types';
import { Download, Share2, Copy, MoreHorizontal, ZoomIn, ZoomOut, RotateCw, Edit3 } from 'lucide-react';

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
}> = ({ content, onEditPrompt, onFacebookAdTextChange }) => {
  const [zoom, setZoom] = useState(100);
  const [showEditPrompt, setShowEditPrompt] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Canvas Toolbar */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-1">
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md">
            {zoom}%
          </span>
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-2" />
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowEditPrompt(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="relative bg-white rounded-lg shadow-lg overflow-hidden" style={{ maxWidth: '600px', maxHeight: '600px' }}>
          <img
            src={content.imageUrl}
            alt="Generated content"
            className="w-full h-full object-contain"
          />
          
          {/* Edit Overlay */}
          {showEditPrompt && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Edit Image</h3>
                <textarea
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder="Describe the changes you want to make..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => {
                      onEditPrompt(editPrompt);
                      setShowEditPrompt(false);
                      setEditPrompt('');
                    }}
                    className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
                  >
                    Apply Changes
                  </button>
                  <button
                    onClick={() => {
                      setShowEditPrompt(false);
                      setEditPrompt('');
                    }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
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
      />
      <ProjectGallery
        sessionGallery={sessionGallery}
        onSelectFromGallery={onSelectFromGallery}
        currentContent={content}
      />
    </div>
  );
};