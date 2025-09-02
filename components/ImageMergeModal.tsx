import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface ImageMergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMerge: (file: File, previewUrl: string, mergeType: string, customInstructions: string) => void;
}

const MERGE_OPTIONS = [
  {
    id: 'overlay',
    name: 'Overlay',
    description: 'Place new image on top of current image'
  },
  {
    id: 'side-by-side',
    name: 'Side by Side',
    description: 'Place images next to each other horizontally'
  },
  {
    id: 'blend',
    name: 'Blend',
    description: 'Seamlessly blend the two images together'
  },
  {
    id: 'replace-product',
    name: 'Replace Product',
    description: 'Replace the main product with the new image'
  },
  {
    id: 'background-merge',
    name: 'Background Merge',
    description: 'Merge as background while keeping current product'
  },
  {
    id: 'composite',
    name: 'Composite',
    description: 'Create artistic composite with both images'
  }
];

export const ImageMergeModal: React.FC<ImageMergeModalProps> = ({ 
  isOpen, 
  onClose, 
  onMerge 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedMergeType, setSelectedMergeType] = useState<string>('overlay');
  const [customInstructions, setCustomInstructions] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setPreviewUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileSelect(imageFile);
    }
  };

  const handleMerge = () => {
    if (selectedFile && previewUrl) {
      onMerge(selectedFile, previewUrl, selectedMergeType, customInstructions);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setSelectedMergeType('overlay');
    setCustomInstructions('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Merge Images</h2>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Image Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Image to Merge
            </label>
            
            {!previewUrl ? (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-50"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Merge Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Merge Type
            </label>
            <div className="space-y-2">
              {MERGE_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="mergeType"
                    value={option.id}
                    checked={selectedMergeType === option.id}
                    onChange={(e) => setSelectedMergeType(e.target.value)}
                    className="mt-1 text-yellow-600 focus:ring-yellow-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {option.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {option.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Instructions (Optional)
            </label>
            <textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="e.g., make it 50% transparent, position in top-left, add shadow..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleMerge}
            disabled={!selectedFile}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ImageIcon className="w-4 h-4" />
            Merge Images
          </button>
        </div>
      </div>
    </div>
  );
};