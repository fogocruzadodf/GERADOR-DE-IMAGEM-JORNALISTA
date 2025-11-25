import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10 p-4 border-b border-gray-700">
      <div className="container mx-auto flex items-center gap-3">
        <SparklesIcon className="w-8 h-8 text-cyan-400" />
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Gerador de Imagem Consistente com IA
        </h1>
      </div>
    </header>
  );
};
