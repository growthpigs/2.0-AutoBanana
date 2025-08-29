import React from 'react';
import { ImageIcon, WarningIcon } from './Icons';
import { EditingTools } from './EditingTools';
// FIX: Import LastGenerationParams to use in props.
import { LoadingState, LastGenerationParams } from '../App';
import { GeneratedContent, FacebookAdContent, MockupContent } from '../types';
import { FacebookAdPreview } from './FacebookAdPreview';

interface WorkspaceProps {
  loadingState: LoadingState;
  generatedContent: GeneratedContent | null;
  error: string | null;
  onEdit: (prompt: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onUploadNew: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isContentGenerated: boolean;
  isLoading: boolean;
  isRepositionMode: boolean;
  onToggleRepositionMode: () => void;
  onRepositionClick: (x: number, y: number) => void;
  onRegenerateImage: () => void;
  onRegenerateText: () => void;
  onNewVariation: () => void;
  sessionGallery: GeneratedContent[];
  onSelectFromGallery: (content: GeneratedContent) => void;
  onFacebookAdTextChange: (newContent: Partial<FacebookAdContent>) => void;
  // FIX: Add missing lastGenerationParams prop.
  lastGenerationParams: LastGenerationParams | null;
}

const LoadingIndicator: React.FC<{ state: LoadingState }> = ({ state }) => {
    const messages = {
        'generating_text': 'Writing compelling ad copy...',
        'generating_image': 'Creating your ad creative...',
        'editing': 'Applying your edits...',
        'describing': 'Analyzing your product...',
        'idle': 'Starting up...',
    };
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-indigo-600 border-l-indigo-600 border-b-indigo-600/10 border-r-indigo-600/10 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-lg font-semibold text-indigo-700">{messages[state]}</p>
        <p className="mt-1 text-sm text-gray-500">This can take a moment.</p>
      </div>
    );
};

const InitialState: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center text-gray-400 h-full">
        <ImageIcon className="w-20 h-20 mb-4" />
        <h3 className="text-xl font-bold text-gray-600">Your Ad Awaits</h3>
        <p className="text-gray-500 mt-2">Select a format from the sidebar to begin.</p>
    </div>
);

const ErrorState: React.FC<{ error: string }> = ({ error }) => {
    const isSafetyError = error.includes('PROHIBITED_CONTENT') || error.includes('SAFETY');
    return (
      <div className="flex flex-col items-center justify-center text-center p-4">
          <WarningIcon className="w-16 h-16 text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-red-600">Generation Failed</h3>
          <p className="text-gray-600 mt-2 max-w-md bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>
          {isSafetyError && (
              <div className="mt-4 text-left text-sm text-gray-500 max-w-md p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-semibold text-gray-700 mb-2">This may have been caused by a safety filter.</h4>
                  <p className="mb-2">To get the best results, please try the following:</p>
                  <ul className="list-disc list-inside space-y-1">
                      <li>Try using a different product image.</li>
                      <li>Select a different ad format or slogan style.</li>
                      <li>If using the "Adjust" tool, try a more neutral description.</li>
                  </ul>
                   <p className="mt-3">The model avoids generating certain types of content. Your request may have been too close to a restricted category.</p>
              </div>
          )}
      </div>
    );
};


export const Workspace: React.FC<WorkspaceProps> = (props) => {
  const { loadingState, generatedContent, error, isContentGenerated, isRepositionMode, onRepositionClick, sessionGallery, onSelectFromGallery } = props;

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isRepositionMode || !generatedContent || 'headline' in generatedContent) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0 to 1
    const y = (e.clientY - rect.top) / rect.height; // 0 to 1
    onRepositionClick(x, y);
  };

  const renderContent = () => {
    if (loadingState !== 'idle') return <LoadingIndicator state={loadingState} />;
    if (error) return <ErrorState error={error} />;
    if (generatedContent) {
        if ('headline' in generatedContent) { // It's a FacebookAdContent
            return <FacebookAdPreview content={generatedContent} onTextChange={props.onFacebookAdTextChange} />
        } else { // It's a MockupContent
            return (
                <img 
                    src={generatedContent.imageUrl} 
                    alt="Generated ad mockup" 
                    className={`w-full h-full object-contain ${isRepositionMode ? 'cursor-crosshair' : ''}`}
                    onClick={handleImageClick}
                />
            );
        }
    }
    return <InitialState />;
  };

  const renderGalleryItem = (content: GeneratedContent, index: number) => {
      return (
        <button 
            key={index} 
            onClick={() => onSelectFromGallery(content)} 
            className="aspect-square bg-gray-100 rounded-md overflow-hidden border-2 border-transparent hover:border-indigo-500 focus:border-indigo-500 focus:outline-none transition-colors"
            aria-label={`Select variation ${index + 1}`}
        >
            <img src={content.imageUrl} alt={`Variation ${index + 1}`} className="w-full h-full object-cover" />
        </button>
      )
  }

  return (
    <div className="flex flex-col w-full h-full gap-6">
        <div className="flex-grow bg-white rounded-xl shadow-lg w-full min-h-[50vh] max-h-[60vh] flex items-center justify-center p-4 border border-gray-200">
            {renderContent()}
        </div>
        
        {isContentGenerated && (
             <EditingTools {...props} />
        )}

        {sessionGallery.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Session Variations</h3>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
                    {sessionGallery.map(renderGalleryItem)}
                </div>
            </div>
        )}
    </div>
  );
};