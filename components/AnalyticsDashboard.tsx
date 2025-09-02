import React from 'react';
import { TrendingUp, Users, Target, Zap, BarChart3, Eye, MousePointer, Clock } from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your ad generation performance and usage statistics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Generations</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">2,847</p>
                <p className="text-sm text-green-600 mt-1">↗ 12% from last month</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">94.2%</p>
                <p className="text-sm text-green-600 mt-1">↗ 2.1% from last month</p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Generation Time</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">3.2s</p>
                <p className="text-sm text-green-600 mt-1">↘ 0.8s faster</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">847</p>
                <p className="text-sm text-green-600 mt-1">↗ 23% from last month</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Usage Trends */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Generation Trends</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Chart visualization would go here</p>
              </div>
            </div>
          </div>

          {/* Popular Formats */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Popular Formats</h3>
            <div className="space-y-4">
              {[
                { name: 'Social Media Posts', usage: 45, color: 'bg-blue-500' },
                { name: 'Facebook Ads', usage: 32, color: 'bg-green-500' },
                { name: 'Instagram Stories', usage: 23, color: 'bg-purple-500' },
                { name: 'Billboard Mockups', usage: 18, color: 'bg-yellow-500' },
                { name: 'Product Displays', usage: 15, color: 'bg-red-500' }
              ].map((format, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{format.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${format.color}`} 
                        style={{ width: `${format.usage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{format.usage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-4 bg-blue-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Visual Quality</h4>
              <p className="text-3xl font-bold text-blue-600 mb-2">9.4/10</p>
              <p className="text-sm text-gray-600">Average quality rating from users</p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-green-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MousePointer className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">User Engagement</h4>
              <p className="text-3xl font-bold text-green-600 mb-2">87%</p>
              <p className="text-sm text-gray-600">Users who generate multiple ads</p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-purple-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Growth Rate</h4>
              <p className="text-3xl font-bold text-purple-600 mb-2">+127%</p>
              <p className="text-sm text-gray-600">Month-over-month growth</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};