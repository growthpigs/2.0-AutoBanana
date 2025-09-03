import React, { useState, useRef } from 'react';
import { Sparkles, Type, Image, Plus, ChevronDown, Send, Search, Upload } from 'lucide-react';
import { GeneratedContent } from '../types';

interface GlobalToolbarProps {
  isLoading: boolean;
  onNewVariation: () => void;
  onRegenerateText: () => void;
  onRegenerateImage: () => void;
  onEditPrompt: (prompt: string) => void;
  onImageUpload: (file: File, previewUrl: string) => void;
  uploadsCount: number;
  generationsCount: number;
  sessionGallery: GeneratedContent[];
  onSelectFromGallery: (content: GeneratedContent) => void;
}

export const GlobalToolbar: React.FC<GlobalToolbarProps> = ({
  isLoading,
  onNewVariation,
  onRegenerateText,
  onRegenerateImage,
  onEditPrompt,
  onImageUpload,
  uploadsCount,
  generationsCount,
  sessionGallery,
  onSelectFromGallery
}) => {
  const [chatInput, setChatInput] = useState('');
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'uploads' | 'generations'>('uploads');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    e.target.value = '';
  };

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Main Toolbar Row */}
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: Setup/Formats/Advanced Tabs */}
        <div className="flex items-center gap-6">
          <button className="px-3 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-md">
            Setup
          </button>
          <button className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors">
            Formats
          </button>
          <button className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors">
            Advanced
          </button>
        </div>

        {/* Center: Editing Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNewVariation}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Variation</span>
          </button>
          
          <button
            onClick={onRegenerateText}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Type className="w-4 h-4" />
            <span>Text</span>
          </button>
          
          <button
            onClick={onRegenerateImage}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Image className="w-4 h-4" />
            <span>Blend Images</span>
          </button>

          {/* Add Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowImageMenu(!showImageMenu)}
              disabled={isLoading}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            
            {showImageMenu && (
              <div className="absolute left-0 top-full mt-1 w-40 bg-white border border-gray-200/80 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setShowImageMenu(false);
                    onEditPrompt('Merge the uploaded image with the current image, blending them naturally');
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Merge Images
                </button>
                <button
                  onClick={() => {
                    setShowImageMenu(false);
                    fileInputRef.current?.click();
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Upload New
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Chat Input + Upload + Tabs */}
        <div className="flex items-center gap-4">
          {/* Chat Input */}
          <form onSubmit={(e) => {
            e.preventDefault();
            if (chatInput.trim() && !isLoading) {
              onEditPrompt(chatInput);
              setChatInput('');
            }
          }} className="relative">
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Describe changes (e.g., 'make it brighter', 'add sunset background')"
              className="w-80 px-4 pr-12 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400 resize-none"
              style={{ backgroundColor: '#fafafa' }}
              disabled={isLoading}
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (chatInput.trim() && !isLoading) {
                    onEditPrompt(chatInput);
                    setChatInput('');
                  }
                }
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !chatInput.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-yellow-600 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-4 h-4" />
            Upload Image
          </button>

          {/* Uploads/Generations Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('uploads')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'uploads'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Uploads ({uploadsCount})
            </button>
            <button
              onClick={() => setActiveTab('generations')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'generations'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Generations ({generationsCount})
            </button>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};