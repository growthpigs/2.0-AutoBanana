
import React, { useState } from 'react';
import { DownloadIcon, ImageIcon, MoveIcon, SparklesIcon, TextIcon } from './Icons';
import { GeneratedContent } from '../types';
import { LastGenerationParams } from '../App';

interface EditingToolsProps {
  generatedContent: GeneratedContent | null;
  onEdit: (prompt: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onUploadNew: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isLoading: boolean;
  isRepositionMode: boolean;
  onToggleRepositionMode: () => void;
  onRegenerateImage: () => void;
  onRegenerateText: () => void;
  onNewVariation: () => void;
  lastGenerationParams: LastGenerationParams | null;
}

const TABS = ['Adjust', 'Reposition'];

export const EditingTools: React.FC<EditingToolsProps> = ({
  generatedContent, onEdit, onUndo, onRedo, onReset, onUploadNew, canUndo, canRedo, isLoading, isRepositionMode, onToggleRepositionMode,
  onRegenerateImage, onRegenerateText, onNewVariation, lastGenerationParams
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [adjustmentInput, setAdjustmentInput] = useState('');
  
  const isFacebookAd = generatedContent && 'headline' in generatedContent;
  const generatedImage = generatedContent?.imageUrl || null;

  const adjustments = [
    { name: 'Enhance Quality', prompt: 'Rerender the user\'s product image within the scene at the highest possible fidelity. Enhance its details, sharpen its lines, and remove any pixelation or artifacts as if it were a vector graphic. The overall composition and style must remain the same.' },
    { name: 'Blur Background', prompt: 'Apply a professional bokeh effect to blur the background, making the main subject stand out.' },
    { name: 'Warmer Lighting', prompt: 'Adjust the color temperature to give the image a warmer, more inviting golden-hour feel.' },
    { name: 'Studio Light', prompt: 'Re-light the image as if it were in a professional photo studio with clean, bright, and even lighting.' },
  ];

  const handleAdjustmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adjustmentInput.trim()) {
      onEdit(adjustmentInput);
      setAdjustmentInput('');
    }
  };
  
  const handleTabClick = (index: number) => {
      if (isFacebookAd) return;
      setActiveTab(index);
      if (TABS[index] === 'Reposition') {
          if(!isRepositionMode) onToggleRepositionMode();
      } else {
          if(isRepositionMode) onToggleRepositionMode();
      }
  }
  
  const regenerationButtonClasses = "flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors";

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      {/* Regeneration Controls */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <button onClick={onRegenerateImage} disabled={isLoading || isFacebookAd} className={regenerationButtonClasses}>
          <ImageIcon className="w-4 h-4" />
          Regenerate Image
        </button>
        <button 
            onClick={onRegenerateText} 
            disabled={isLoading || isFacebookAd || !lastGenerationParams?.sloganType} 
            className={regenerationButtonClasses}
        >
          <TextIcon className="w-4 h-4" />
          Regenerate Text
        </button>
        <button onClick={onNewVariation} disabled={isLoading || isFacebookAd} className={regenerationButtonClasses}>
          <SparklesIcon className="w-4 h-4" />
          New Variation
        </button>
      </div>

      {/* Top Bar with Tabs and History */}
      <div className="flex justify-between items-center border-t border-gray-200 pt-4">
        <div>
          <div className="hidden sm:block">
            <nav className="flex space-x-1" aria-label="Tabs">
              {TABS.map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(index)}
                  disabled={isFacebookAd}
                  className={`${
                    activeTab === index && !isFacebookAd ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  } rounded-md px-3 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>
        <div className="flex items-center space-x-2">
            <button onClick={onUndo} disabled={!canUndo || isLoading} className="px-3 py-2 text-sm font-medium text-gray-600 bg-white rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50">Undo</button>
            <button onClick={onRedo} disabled={!canRedo || isLoading} className="px-3 py-2 text-sm font-medium text-gray-600 bg-white rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50">Redo</button>
        </div>
      </div>
      
      <div className={`mt-4 ${isFacebookAd ? 'opacity-50' : ''}`}>
        {activeTab === 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-800">Apply a Professional Adjustment</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {adjustments.map(adj => (
                    <button 
                        key={adj.name} 
                        onClick={() => onEdit(adj.prompt)}
                        disabled={isLoading || isFacebookAd}
                        className={`py-2 px-3 text-sm font-medium text-gray-700 rounded-md border border-gray-200 hover:bg-gray-200 disabled:opacity-50 flex items-center justify-center gap-2
                          ${adj.name === 'Enhance Quality' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' : 'bg-gray-100'}
                        `}
                    >
                      {adj.name === 'Enhance Quality' && <SparklesIcon className="w-4 h-4" />}
                      {adj.name}
                    </button>
                ))}
            </div>
            <form onSubmit={handleAdjustmentSubmit} className="flex gap-2">
              <input
                type="text"
                value={adjustmentInput}
                onChange={(e) => setAdjustmentInput(e.target.value)}
                placeholder="Or describe an adjustment (e.g., 'change background to a forest')"
                className="flex-grow bg-white border border-gray-300 text-gray-900 rounded-md focus:ring-indigo-500 focus:border-indigo-500 block p-2 text-sm"
                disabled={isLoading || isFacebookAd}
              />
              <button type="submit" disabled={isLoading || isFacebookAd || !adjustmentInput.trim()} className="px-4 py-2 rounded-md bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 disabled:bg-indigo-300">Apply</button>
            </form>
          </div>
        )}

        {activeTab === 1 && !isFacebookAd && (
          <div className="flex flex-col items-center justify-center text-center text-gray-500 p-4 min-h-[120px]">
              <MoveIcon className="w-8 h-8 mb-2 text-indigo-500" />
              <h3 className="font-semibold text-gray-700">Reposition Mode Active</h3>
              <p>Click a location on the image above to move the slogan.</p>
          </div>
        )}
      </div>


      {/* Bottom Action Buttons */}
      <div className="border-t border-gray-200 mt-6 pt-4 flex items-center justify-between">
         <div>
            <button onClick={onReset} disabled={!canUndo || isLoading} className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50">Reset</button>
            <button onClick={onUploadNew} disabled={isLoading} className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50">Upload New</button>
         </div>
      </div>
   </div>
 );
}