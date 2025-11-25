import React, { useState, useCallback } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { ResultDisplay } from './components/ResultDisplay';
import { Header } from './components/Header';
import { generateImage, generateThumbnail } from './services/geminiService';
import { ImageGeneratorInputs, ThumbnailGeneratorInputs } from './types';

const App: React.FC = () => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageGeneration = useCallback(async (inputs: ImageGeneratorInputs) => {
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const imageUrl = await generateImage(inputs);
      setGeneratedImage(imageUrl);
    } catch (e) {
      console.error(e);
      setError('Falha ao gerar a imagem. Verifique o console para mais detalhes.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleThumbnailGeneration = useCallback(async (inputs: ThumbnailGeneratorInputs) => {
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const imageUrl = await generateThumbnail(inputs);
      setGeneratedImage(imageUrl);
    } catch (e) {
      console.error(e);
      setError('Falha ao gerar a thumbnail. Verifique o console para mais detalhes.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="flex flex-col lg:flex-row gap-8 p-4 md:p-8">
        <div className="lg:w-1/3 xl:w-1/4">
          <ControlPanel 
            onGenerateImage={handleImageGeneration} 
            onGenerateThumbnail={handleThumbnailGeneration}
            isLoading={isLoading} 
          />
        </div>
        <div className="lg:w-2/3 xl:w-3/4">
          <ResultDisplay 
            image={generatedImage} 
            isLoading={isLoading} 
            error={error} 
          />
        </div>
      </main>
    </div>
  );
};

export default App;
