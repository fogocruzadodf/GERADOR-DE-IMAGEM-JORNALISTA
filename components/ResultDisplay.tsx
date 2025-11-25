import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { PhotoIcon } from './icons/PhotoIcon';

interface ResultDisplayProps {
  image: string | null;
  isLoading: boolean;
  error: string | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ image, isLoading, error }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-2xl h-full flex flex-col items-center justify-center min-h-[400px] lg:min-h-0">
      {isLoading ? (
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-lg text-gray-300 animate-pulse">Gerando imagem... Isso pode levar um momento.</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-400">
          <p className="font-bold">Ocorreu um erro</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      ) : image ? (
        <div className="w-full">
            <img src={image} alt="Generated result" className="rounded-md max-w-full max-h-[80vh] mx-auto object-contain" />
            <a href={image} download="generated-image.png" className="mt-4 inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition">
              Baixar Imagem
            </a>
        </div>
      ) : (
        <div className="text-center text-gray-500">
            <PhotoIcon className="mx-auto h-24 w-24 text-gray-600" />
          <h3 className="mt-2 text-lg font-medium text-gray-300">Sua imagem aparecerá aqui</h3>
          <p className="mt-1 text-sm">Preencha os campos e clique em "Gerar" para começar.</p>
        </div>
      )}
    </div>
  );
};
