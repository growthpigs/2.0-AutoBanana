import React, { useState } from 'react';
import { SloganType, UploadedImage, SmartProductInput, AdFormat } from '../types';
import { SparklesIcon, CheckCircle, Upload, Filter, Settings, Layers } from 'lucide-react';
import { AD_FORMATS, SOCIAL_MEDIA_FORMATS, FACEBOOK_AD_FORMATS } from '../constants';
import { FormatSelectionGrid } from './FormatSelectionGrid';

interface ProfessionalSidebarProps {
  imageLibrary: UploadedImage[];
  generatedGallery: any[];
  selectedImage: UploadedImage;
  onSelectFromLibrary: (image: UploadedImage) => void;
  onDeleteFromLibrary: (imageId: string) => void;
  onGenerate: (environmentOrFormats?: string | AdFormat[]) => void;
  isLoading: boolean;
  smartInput: SmartProductInput;
  onSmartInputChange: (input: SmartProductInput) => void;
  isDescriptionLoading: boolean;
  onImageUpload: (file: File, previewUrl: string) => void;
  onGenerateDescription: () => void;
  selectedSloganType: SloganType | null;
  onSelectSloganType: (type: SloganType | null) => void;
  onResetAnalysis: () => void;
  onReanalyze: () => void;
}

type TabType = 'setup' | 'formats' | 'blend-pro';

export const ProfessionalSidebar: React.FC<ProfessionalSidebarProps> = ({
  imageLibrary,
  generatedGallery,
  selectedImage,
  onSelectFromLibrary,
  onDeleteFromLibrary,
  onGenerate,
  isLoading,
  smartInput,
  onSmartInputChange,
  isDescriptionLoading,
  onImageUpload,
  onGenerateDescription,
  selectedSloganType,
  onSelectSloganType,
  onResetAnalysis,
  onReanalyze,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('setup');
  const [selectedFormats, setSelectedFormats] = useState<AdFormat[]>([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState<string | null>(null);

  React.useEffect(() => {
    if (selectedImage?.analysis?.naturalEnvironments && selectedImage.analysis.naturalEnvironments.length > 0) {
      if (!selectedEnvironment || !selectedImage.analysis.naturalEnvironments.includes(selectedEnvironment)) {
        setSelectedEnvironment(selectedImage.analysis.naturalEnvironments[0]);
      }
    }
  }, [selectedImage?.analysis?.naturalEnvironments]);

  const hasImage = !!selectedImage;
  const hasAnalysis = !!selectedImage?.analysis;
  
  const sloganTypes: { id: SloganType; name: string }[] = [
    { id: 'hook', name: 'Hook' },
    { id: 'tagline', name: 'Tagline' },
    { id: 'meme', name: 'Meme' },
    { id: 'joke', name: 'Joke' },
    { id: 'quote', name: 'Quote' },
    { id: 'fun_fact', name: 'Fun Fact' },
  ];

  const toggleFormat = (format: AdFormat) => {
    setSelectedFormats(prev => {
      const exists = prev.find(f => f.id === format.id);
      if (exists) {
        return prev.filter(f => f.id !== format.id);
      } else {
        return [...prev, format];
      }
    });
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full relative">
      {/* Professional Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('setup')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'setup' 
                ? 'border-yellow-400 text-gray-900 bg-yellow-50' 
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Upload className="w-4 h-4" />
            Setup
          </button>
          <button
            onClick={() => setActiveTab('formats')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'formats' 
                ? 'border-yellow-400 text-gray-900 bg-yellow-50' 
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            Formats
          </button>
          <button
            onClick={() => setActiveTab('blend-pro')}
            className={`flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'blend-pro' 
                ? 'border-yellow-400 text-gray-900 bg-yellow-50' 
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="text-xs">Blend Pro</span>
            <span className="ml-1 px-2 py-0.5 text-[10px] bg-gradient-to-r from-yellow-400 to-pink-500 text-white rounded-full font-bold">PRO</span>
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'setup' && (
          <div className="space-y-6">
            {/* AI Analysis Status */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">AI Analysis</h3>
              <div className={`rounded-lg border p-3 ${hasAnalysis ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                {hasAnalysis ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Analysis Complete</span>
                      <span className="text-xs bg-green-100 px-2 py-0.5 rounded-full">
                        {selectedImage?.analysis?.confidence || 95}%
                      </span>
                    </div>
                    <button
                      onClick={() => onReanalyze()}
                      disabled={isLoading}
                      className="text-xs text-green-600 hover:text-green-700 disabled:opacity-50"
                    >
                      Re-analyze
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2">No analysis available</div>
                    <button
                      onClick={() => onGenerateDescription()}
                      disabled={!hasImage || isLoading || isDescriptionLoading}
                      className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md disabled:opacity-50"
                    >
                      {isDescriptionLoading ? 'Analyzing...' : 'Analyze Image'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Product Information */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Product Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Product Title</label>
                  <input
                    type="text"
                    value={smartInput.title}
                    onChange={(e) => onSmartInputChange({ ...smartInput, title: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Enter product title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Industry</label>
                    <select
                      value={smartInput.industry || ''}
                      onChange={(e) => onSmartInputChange({ ...smartInput, industry: e.target.value as any })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="">Select</option>
                      <option value="Entertainment & Media">Entertainment</option>
                      <option value="Technology">Technology</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Food & Beverage">Food & Bev</option>
                      <option value="Health & Wellness">Health</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Audience</label>
                    <select
                      value={smartInput.targetAudience || ''}
                      onChange={(e) => onSmartInputChange({ ...smartInput, targetAudience: e.target.value as any })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="">Select</option>
                      <option value="Gen Z (18-26)">Gen Z</option>
                      <option value="Millennials (27-42)">Millennials</option>
                      <option value="Gen X (43-58)">Gen X</option>
                      <option value="Boomers (59+)">Boomers</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={smartInput.description}
                    onChange={(e) => onSmartInputChange({ ...smartInput, description: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                    placeholder="Describe your product..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Environment Options */}
            {hasAnalysis && selectedImage?.analysis?.naturalEnvironments && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-sm font-medium text-gray-900">Natural Environments</h3>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    {selectedImage.analysis.naturalEnvironments.length} found
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {selectedImage.analysis.naturalEnvironments.slice(0, 6).map((env, index) => (
                    <button
                      key={`${env}-${index}`}
                      onClick={() => setSelectedEnvironment(env)}
                      className={`p-2 text-xs font-medium rounded-md border transition-all text-left ${
                        selectedEnvironment === env
                          ? 'border-yellow-400 bg-yellow-50 text-gray-900'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {env}
                    </button>
                  ))}
                </div>
                {selectedEnvironment && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="text-xs text-blue-700">
                      ✨ Selected: <span className="font-medium">{selectedEnvironment}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Text Options */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Text Style (Optional)</h3>
              <div className="grid grid-cols-3 gap-2">
                {sloganTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => onSelectSloganType(selectedSloganType === type.id ? null : type.id)}
                    disabled={!hasImage}
                    className={`px-2 py-1.5 text-xs font-medium rounded-md border transition-all ${
                      selectedSloganType === type.id
                        ? 'border-yellow-400 bg-yellow-50 text-gray-900'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    } ${!hasImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button - positioned under text options */}
            <div className="mt-6">
              <button
                onClick={() => {
                  if (activeTab === 'setup' && selectedEnvironment) {
                    onGenerate(selectedEnvironment);
                  } else if (activeTab === 'blend-pro') {
                    onGenerate('blend-pro-environment');
                  } else if (selectedFormats.length > 0) {
                    onGenerate(selectedFormats);
                  }
                }}
                disabled={!hasImage || isLoading || (activeTab === 'formats' && selectedFormats.length === 0)}
                className={`w-2/3 mx-auto px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border-2 shadow-lg ${
                  !hasImage || (activeTab === 'formats' && selectedFormats.length === 0)
                    ? 'bg-white text-gray-400 border-gray-300 cursor-not-allowed opacity-50'
                    : isLoading
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-black hover:bg-black hover:text-white'
                }`}
              >
                <SparklesIcon className="w-4 h-4" />
                {isLoading ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'formats' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Ad Mockups</h3>
              <FormatSelectionGrid
                formats={AD_FORMATS}
                selectedFormats={selectedFormats}
                onToggleFormat={toggleFormat}
                category="mockups"
                getRecommendedFormats={() => []}
                isFormatRecommended={() => false}
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Social Media</h3>
              <FormatSelectionGrid
                formats={SOCIAL_MEDIA_FORMATS}
                selectedFormats={selectedFormats}
                onToggleFormat={toggleFormat}
                category="social"
                getRecommendedFormats={() => []}
                isFormatRecommended={() => false}
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Facebook Ads</h3>
              <FormatSelectionGrid
                formats={FACEBOOK_AD_FORMATS}
                selectedFormats={selectedFormats}
                onToggleFormat={toggleFormat}
                category="facebook"
                getRecommendedFormats={() => []}
                isFormatRecommended={() => false}
              />
            </div>

            {/* Generate Button - positioned at bottom of formats tab */}
            <div className="mt-6">
              <button
                onClick={() => {
                  if (selectedFormats.length > 0) {
                    onGenerate(selectedFormats);
                  }
                }}
                disabled={!hasImage || isLoading || selectedFormats.length === 0}
                className={`w-2/3 mx-auto px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border-2 shadow-lg ${
                  !hasImage || selectedFormats.length === 0
                    ? 'bg-white text-gray-400 border-gray-300 cursor-not-allowed opacity-50'
                    : isLoading
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-black hover:bg-black hover:text-white'
                }`}
              >
                <SparklesIcon className="w-4 h-4" />
                {isLoading ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'blend-pro' && (
          <div className="space-y-6">
            {/* Character DNA System */}
            <div className="border border-yellow-200 rounded-lg p-4 bg-gradient-to-r from-yellow-50 to-pink-50">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full"></div>
                <h3 className="text-sm font-semibold text-gray-900">Character DNA™</h3>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">#1 Requested</span>
              </div>
              <p className="text-xs text-gray-600 mb-3">Create consistent characters across all your generations</p>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-xs bg-white border border-gray-200 rounded-md hover:bg-gray-50">
                  + Save Character Template
                </button>
                <button className="w-full text-left px-3 py-2 text-xs bg-white border border-gray-200 rounded-md hover:bg-gray-50">
                  📁 Load Saved Character (0)
                </button>
              </div>
            </div>

            {/* Natural Language Commands */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <h3 className="text-sm font-semibold text-gray-900">Natural Language Editing</h3>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-gray-600 mb-2">Tell the AI exactly what to change:</div>
                <div className="grid grid-cols-1 gap-2">
                  <button className="text-left px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100">
                    "Remove the background"
                  </button>
                  <button className="text-left px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100">
                    "Make it brighter and more vibrant"
                  </button>
                  <button className="text-left px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100">
                    "Add a professional office background"
                  </button>
                </div>
              </div>
            </div>

            {/* Smart Object Removal */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <h3 className="text-sm font-semibold text-gray-900">Smart Object Removal</h3>
              </div>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-xs bg-white border border-gray-200 rounded-md hover:bg-gray-50">
                  🎯 Remove Unwanted Objects
                </button>
                <button className="w-full text-left px-3 py-2 text-xs bg-white border border-gray-200 rounded-md hover:bg-gray-50">
                  🔄 Replace with Similar Objects
                </button>
                <button className="w-full text-left px-3 py-2 text-xs bg-white border border-gray-200 rounded-md hover:bg-gray-50">
                  ✨ Content-Aware Fill
                </button>
              </div>
            </div>

            {/* Batch Processing */}
            <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <h3 className="text-sm font-semibold text-gray-900">Batch Processing</h3>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Enterprise</span>
              </div>
              <p className="text-xs text-gray-600 mb-3">Process multiple images with same style</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Queue: 0 images</span>
                  <button className="text-purple-600 hover:text-purple-700">+ Add Images</button>
                </div>
                <button className="w-full px-3 py-2 text-xs bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200">
                  🚀 Process All (72% CTR Boost)
                </button>
              </div>
            </div>

            {/* Style Lock & Transfer */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <h3 className="text-sm font-semibold text-gray-900">Style Lock & Transfer</h3>
              </div>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-xs bg-white border border-gray-200 rounded-md hover:bg-gray-50">
                  🎨 Lock Current Style
                </button>
                <button className="w-full text-left px-3 py-2 text-xs bg-white border border-gray-200 rounded-md hover:bg-gray-50">
                  📋 Apply Style to New Images
                </button>
                <div className="text-xs text-gray-500 mt-2">
                  Saved Styles: Brand_Primary, Summer_Campaign
                </div>
              </div>
            </div>

            {/* Professional Settings */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <h3 className="text-sm font-semibold text-gray-900">Professional Settings</h3>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span>Character Consistency</span>
                  <div className="w-8 h-4 bg-yellow-400 rounded-full relative">
                    <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Style Locking</span>
                  <div className="w-8 h-4 bg-yellow-400 rounded-full relative">
                    <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Multi-Character Scenes</span>
                  <div className="w-8 h-4 bg-gray-300 rounded-full relative">
                    <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Instructions */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Advanced Instructions</h3>
              <textarea
                value={smartInput.instructions || ''}
                onChange={(e) => onSmartInputChange({ ...smartInput, instructions: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                placeholder="Professional-grade custom instructions for character DNA, style consistency, and advanced editing..."
                rows={3}
              />
            </div>

            {/* Generate Button - positioned at bottom of blend-pro tab */}
            <div className="mt-6">
              <button
                onClick={() => {
                  onGenerate('blend-pro-environment');
                }}
                disabled={!hasImage || isLoading}
                className={`w-2/3 mx-auto px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border-2 shadow-lg ${
                  !hasImage
                    ? 'bg-white text-gray-400 border-gray-300 cursor-not-allowed opacity-50'
                    : isLoading
                    ? 'bg-gradient-to-r from-yellow-500 to-pink-600 text-white border-transparent'
                    : 'bg-gradient-to-r from-yellow-400 to-pink-500 text-white border-transparent hover:from-yellow-500 hover:to-pink-600'
                }`}
              >
                <SparklesIcon className="w-4 h-4" />
                {isLoading ? 'Generating...' : 'Generate Pro'}
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};