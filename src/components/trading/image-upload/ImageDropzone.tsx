import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface ImageDropzoneProps {
  onImageSelected: (file: File) => void;
  isAnalyzing: boolean;
}

/**
 * ImageDropzone Component
 * Handles drag-and-drop functionality for image uploads
 */
export const ImageDropzone = ({ onImageSelected, isAnalyzing }: ImageDropzoneProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        onImageSelected(file);
      }
    },
    accept: { 'image/*': [] },
    maxFiles: 1,
    maxSize: 4 * 1024 * 1024
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        {isAnalyzing ? 'Analyzing...' : 'Drop a trading chart screenshot here, or click to select'}
      </p>
      <p className="text-xs text-gray-500 mt-1">You can also paste (Ctrl+V) a screenshot</p>
    </div>
  );
};