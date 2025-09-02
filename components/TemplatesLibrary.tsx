import React, { useState } from 'react';
import { Search, Filter, Heart, Download, Eye, Star, Grid3X3, List } from 'lucide-react';

export const TemplatesLibrary: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Templates', count: 248 },
    { id: 'social', name: 'Social Media', count: 89 },
    { id: 'ads', name: 'Ad Campaigns', count: 67 },
    { id: 'ecommerce', name: 'E-commerce', count: 45 },
    { id: 'fashion', name: 'Fashion', count: 32 },
    { id: 'tech', name: 'Technology', count: 28 },
    { id: 'food', name: 'Food & Beverage', count: 24 }
  ];

  const templates = [
    {
      id: 1,
      name: 'Modern Product Showcase',
      category: 'E-commerce',
      thumbnail: '/api/placeholder/300/200',
      rating: 4.9,
      downloads: 1234,
      tags: ['Product', 'Clean', 'Modern'],
      premium: false
    },
    {
      id: 2,
      name: 'Instagram Story Fashion',
      category: 'Social Media',
      thumbnail: '/api/placeholder/300/200',
      rating: 4.8,
      downloads: 987,
      tags: ['Instagram', 'Fashion', 'Story'],
      premium: true
    },
    {
      id: 3,
      name: 'Facebook Ad Campaign',
      category: 'Ad Campaigns',
      thumbnail: '/api/placeholder/300/200',
      rating: 4.7,
      downloads: 756,
      tags: ['Facebook', 'Advertising', 'Conversion'],
      premium: false
    },
    {
      id: 4,
      name: 'Tech Product Launch',
      category: 'Technology',
      thumbnail: '/api/placeholder/300/200',
      rating: 4.9,
      downloads: 543,
      tags: ['Tech', 'Launch', 'Innovation'],
      premium: true
    },
    {
      id: 5,
      name: 'Food Photography Style',
      category: 'Food & Beverage',
      thumbnail: '/api/placeholder/300/200',
      rating: 4.6,
      downloads: 432,
      tags: ['Food', 'Photography', 'Appetizing'],
      premium: false
    },
    {
      id: 6,
      name: 'Minimalist Brand Focus',
      category: 'Social Media',
      thumbnail: '/api/placeholder/300/200',
      rating: 4.8,
      downloads: 389,
      tags: ['Minimalist', 'Brand', 'Clean'],
      premium: false
    }
  ];

  return (
    <div className="flex-1 flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Templates</h2>
        
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Categories */}
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                selectedCategory === category.id
                  ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{category.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                selectedCategory === category.id
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Template Library</h1>
              <p className="text-sm text-gray-600 mt-1">
                {selectedCategory === 'all' ? 'All templates' : categories.find(c => c.id === selectedCategory)?.name} • 
                {categories.find(c => c.id === selectedCategory)?.count} templates
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 border-l border-gray-300 ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 p-6">
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {templates.map(template => (
              <div key={template.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
                {viewMode === 'grid' ? (
                  <>
                    <div className="aspect-video bg-gray-100 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">Template Preview</span>
                      </div>
                      {template.premium && (
                        <div className="absolute top-2 left-2 bg-yellow-400 text-gray-900 px-2 py-1 rounded-md text-xs font-semibold">
                          PRO
                        </div>
                      )}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50">
                          <Heart className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight">{template.name}</h3>
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-3">{template.category}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-md">
                            {tag}
                          </span>
                        ))}
                        {template.tags.length > 2 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">
                            +{template.tags.length - 2}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span>{template.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          <span>{template.downloads.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center p-4">
                    <div className="w-20 h-14 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                      <span className="text-gray-500 text-xs">Preview</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">{template.name}</h3>
                          <p className="text-xs text-gray-600 mt-1">{template.category}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span>{template.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Download className="w-3 h-3" />
                              <span>{template.downloads.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {template.premium && (
                            <span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded-md text-xs font-semibold">
                              PRO
                            </span>
                          )}
                          <button className="p-1.5 text-gray-400 hover:text-gray-600">
                            <Heart className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-gray-600">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};