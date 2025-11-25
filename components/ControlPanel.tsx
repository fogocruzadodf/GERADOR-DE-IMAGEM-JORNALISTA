import React, { useState } from 'react';
import { ImageGeneratorInputs, ThumbnailGeneratorInputs } from '../types';
import { fileToImageFile } from '../utils/fileUtils';
import { ImageUploader } from './ImageUploader';
import { SparklesIcon } from './icons/SparklesIcon';

interface ControlPanelProps {
  onGenerateImage: (inputs: ImageGeneratorInputs) => void;
  onGenerateThumbnail: (inputs: ThumbnailGeneratorInputs) => void;
  isLoading: boolean;
}

type ActiveTab = 'image' | 'thumbnail';

export const ControlPanel: React.FC<ControlPanelProps> = ({ onGenerateImage, onGenerateThumbnail, isLoading }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('image');
  
  // Image Generator State
  const [characterImage, setCharacterImage] = useState<File | null>(null);
  const [objectImage, setObjectImage] = useState<File | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [clothing, setClothing] = useState('');
  const [action, setAction] = useState('');
  const [journalisticStyle, setJournalisticStyle] = useState(false);

  // Thumbnail Generator State
  const [templateImage, setTemplateImage] = useState<File | null>(null);
  const [thumbCharacterImage, setThumbCharacterImage] = useState<File | null>(null);
  const [thumbBackgroundImage, setThumbBackgroundImage] = useState<File | null>(null);
  const [thumbText, setThumbText] = useState('');

  const handleGenerateImage = async () => {
    if (!characterImage || !clothing || !action) {
      alert('Por favor, preencha todos os campos obrigatórios para gerar a imagem.');
      return;
    }

    try {
      const inputs: ImageGeneratorInputs = {
        characterImage: await fileToImageFile(characterImage),
        objectImage: objectImage ? await fileToImageFile(objectImage) : undefined,
        backgroundImage: backgroundImage ? await fileToImageFile(backgroundImage) : undefined,
        clothing,
        action,
        journalisticStyle,
      };
      onGenerateImage(inputs);
    } catch (error) {
      console.error("Error preparing image files:", error);
      alert("Houve um erro ao processar os arquivos de imagem.");
    }
  };
  
  const handleGenerateThumbnail = async () => {
    if (!templateImage || !thumbCharacterImage || !thumbText) {
      alert('Por favor, preencha todos os campos obrigatórios para gerar a thumbnail.');
      return;
    }
    
    try {
      const inputs: ThumbnailGeneratorInputs = {
        templateImage: await fileToImageFile(templateImage),
        characterImage: await fileToImageFile(thumbCharacterImage),
        backgroundImage: thumbBackgroundImage ? await fileToImageFile(thumbBackgroundImage) : undefined,
        text: thumbText,
      };
      onGenerateThumbnail(inputs);
    } catch (error) {
        console.error("Error preparing thumbnail files:", error);
        alert("Houve um erro ao processar os arquivos de imagem para a thumbnail.");
    }
  };

  const renderImageGenerator = () => (
    <div className="space-y-6">
      <ImageUploader id="character" label="1. Imagem do Personagem (Obrigatório)" onFileSelect={setCharacterImage} />
      <ImageUploader id="object" label="2. Imagem do Produto/Objeto (Opcional)" onFileSelect={setObjectImage} />
      <ImageUploader id="background" label="3. Imagem do Local/Cenário (Opcional)" onFileSelect={setBackgroundImage} />
      
      <div>
        <label htmlFor="clothing" className="block text-sm font-medium text-gray-300 mb-2">4. Estilo da Roupa (Obrigatório)</label>
        <textarea id="clothing" value={clothing} onChange={e => setClothing(e.target.value)} rows={2} className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" placeholder="Ex: Terno preto elegante, vestido de gala vermelho..."></textarea>
      </div>

      <div>
        <label htmlFor="action" className="block text-sm font-medium text-gray-300 mb-2">5. Ação do Personagem (Obrigatório)</label>
        <textarea id="action" value={action} onChange={e => setAction(e.target.value)} rows={2} className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" placeholder="Ex: Sorrindo para a câmera, andando na rua..."></textarea>
      </div>
      
      <div className="flex items-center">
        <input type="checkbox" id="journalistic" checked={journalisticStyle} onChange={e => setJournalisticStyle(e.target.checked)} className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-cyan-600 focus:ring-cyan-500" />
        <label htmlFor="journalistic" className="ml-2 block text-sm text-gray-300">Criar com estilo de matéria jornalística</label>
      </div>

      <button onClick={handleGenerateImage} disabled={isLoading || !characterImage || !clothing || !action} className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-all duration-300">
        <SparklesIcon className="w-5 h-5" />
        {isLoading ? 'Gerando...' : 'Gerar Imagem'}
      </button>
    </div>
  );

  const renderThumbnailGenerator = () => (
    <div className="space-y-6">
      <ImageUploader id="template" label="1. Imagem de Exemplo/Template (Obrigatório)" onFileSelect={setTemplateImage} />
      <ImageUploader id="thumb-character" label="2. Imagem do Personagem (Obrigatório)" onFileSelect={setThumbCharacterImage} />
      <ImageUploader id="thumb-background" label="3. Imagem do Local/Cenário (Opcional)" onFileSelect={setThumbBackgroundImage} />

      <div>
        <label htmlFor="thumb-text" className="block text-sm font-medium text-gray-300 mb-2">4. Texto para a Thumbnail (Obrigatório)</label>
        <textarea id="thumb-text" value={thumbText} onChange={e => setThumbText(e.target.value)} rows={3} className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" placeholder="Ex: GRANDE NOVIDADE!"></textarea>
      </div>
      
      <button onClick={handleGenerateThumbnail} disabled={isLoading || !templateImage || !thumbCharacterImage || !thumbText} className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-all duration-300">
        <SparklesIcon className="w-5 h-5" />
        {isLoading ? 'Gerando...' : 'Gerar Thumbnail'}
      </button>
    </div>
  );

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-2xl h-full">
      <div className="flex border-b border-gray-700 mb-6">
        <button onClick={() => setActiveTab('image')} className={`py-2 px-4 text-sm font-medium transition ${activeTab === 'image' ? 'border-b-2 border-cyan-500 text-white' : 'text-gray-400 hover:text-white'}`}>
          Gerador de Imagem
        </button>
        <button onClick={() => setActiveTab('thumbnail')} className={`py-2 px-4 text-sm font-medium transition ${activeTab === 'thumbnail' ? 'border-b-2 border-cyan-500 text-white' : 'text-gray-400 hover:text-white'}`}>
          Gerador de Thumbnail
        </button>
      </div>
      {activeTab === 'image' ? renderImageGenerator() : renderThumbnailGenerator()}
    </div>
  );
};
