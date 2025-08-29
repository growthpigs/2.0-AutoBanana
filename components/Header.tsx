import React from 'react';
import { CameraIcon } from './Icons';

export const Header: React.FC = () => (
  <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-20">
    <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-center">
      <div className="flex items-center space-x-3">
        <CameraIcon className="w-8 h-8 text-indigo-600" />
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          Adify
        </h1>
      </div>
    </div>
  </header>
);