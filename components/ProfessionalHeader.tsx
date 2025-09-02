import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Settings, User, LogOut, Plus } from 'lucide-react';

export const ProfessionalHeader: React.FC = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProjectMenu, setShowProjectMenu] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      {/* Left Section - Logo & Navigation */}
      <div className="flex items-center gap-6">
        {/* AutoBanana Logo */}
        <div className="flex items-center gap-3">
          <img 
            src="/autobanana-logo-final.svg" 
            alt="AutoBanana" 
            className="h-8 w-auto"
          />
          <div className="h-6 w-px bg-gray-300" />
        </div>

        {/* Project Selector */}
        <div className="relative">
          <button
            onClick={() => setShowProjectMenu(!showProjectMenu)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
          >
            <div className="w-6 h-6 bg-yellow-400 rounded flex items-center justify-center">
              <span className="text-xs font-bold text-gray-900">🍌</span>
            </div>
            <span>autobanana</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          
          {showProjectMenu && (
            <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg w-64 py-2 z-50">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                Personal Account
              </div>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-900 hover:bg-gray-50">
                <div className="w-6 h-6 bg-yellow-400 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-900">🍌</span>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">autobanana</div>
                  <div className="text-xs text-gray-500">AI Ad Generator</div>
                </div>
              </button>
              <div className="border-t border-gray-100 mt-2 pt-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
                  <Plus className="w-4 h-4" />
                  <span>Create New Project</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1">
          <button className="px-3 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-md">
            Overview
          </button>
          <button className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors">
            Analytics
          </button>
          <button className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors">
            Templates
          </button>
          <button className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors">
            Settings
          </button>
        </nav>
      </div>

      {/* Right Section - Search, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <kbd className="px-2 py-0.5 text-xs font-medium text-gray-500 bg-gray-100 rounded border">⌘K</kbd>
          </div>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">2</span>
          </span>
        </button>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded-md transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900">RA</span>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg w-56 py-2 z-50">
              <div className="px-3 py-2 border-b border-gray-100">
                <div className="text-sm font-medium text-gray-900">Roderick Andrews</div>
                <div className="text-xs text-gray-500">roderick@autobanana.com</div>
              </div>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <div className="border-t border-gray-100 mt-2 pt-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};