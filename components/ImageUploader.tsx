import React, { useState, useCallback, ChangeEvent, useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { PhotoIcon } from './icons/PhotoIcon';
import { XIcon } from './icons/XIcon';

interface ImageUploaderProps {
  id: string;
  label: string;
  onFileSelect: (file: File | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, onFileSelect }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setFileName(file.name);
        onFileSelect(file);
      };
      reader.readAsDataURL(file);
    } else {
        setPreview(null);
        setFileName('');
        onFileSelect(null);
    }
  }, [onFileSelect]);

  const handleRemove = useCallback(() => {
    setPreview(null);
    setFileName('');
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [onFileSelect]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          {preview ? (
            <div className="relative group mx-auto h-24 w-auto flex justify-center">
                <img src={preview} alt="Preview" className="h-full w-auto rounded-md object-contain" />
                <button 
                    onClick={handleRemove} 
                    className="absolute top-0 right-0 -mt-2 -mr-2 p-1 bg-gray-700 rounded-full text-white hover:bg-red-500 transition-colors duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Remove image"
                >
                    <XIcon className="w-4 h-4" />
                </button>
            </div>
          ) : (
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-500" />
          )}
          <div className="flex text-sm text-gray-500">
            <label htmlFor={id} className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-cyan-500 hover:text-cyan-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 focus-within:ring-cyan-500">
              <span>Carregar um arquivo</span>
              <input ref={inputRef} id={id} name={id} type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
            </label>
            <p className="pl-1">ou arraste e solte</p>
          </div>
          <p className="text-xs text-gray-600">PNG, JPG, WEBP até 10MB</p>
          {fileName && <p className="text-xs text-cyan-400 truncate max-w-xs mx-auto pt-2">{fileName}</p>}
        </div>
      </div>
    </div>
  );
};
