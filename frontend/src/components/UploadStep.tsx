import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, Loader2 } from 'lucide-react';
import heic2any from 'heic2any';

interface UploadStepProps {
  onImageSelected: (imageElement: HTMLImageElement, file: File) => void;
}

export const UploadStep: React.FC<UploadStepProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      let targetFile = file;

      // Handle HEIC/HEIF files from iPhones
      const isHeic = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');
      if (isHeic) {
        const convertedBlob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.9,
        });

        const blobResult = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        targetFile = new File([blobResult], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
          type: 'image/jpeg',
        });
      }

      // Read as image element
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          onImageSelected(img, targetFile);
          setLoading(false);
        };
        img.onerror = () => {
          setErrorMessage('Failed to decode image file. Please try another image.');
          setLoading(false);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(targetFile);
    } catch (err) {
      console.error('File conversion error:', err);
      setErrorMessage('Could not process photo file. Please upload a standard JPG or PNG.');
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-3 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-[#FEE101] bg-[#0B6839]/10 scale-102'
            : 'border-[#0B6839] bg-[#FFF8EB] hover:border-[#FEE101] hover:bg-white'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          accept="image/png, image/jpeg, image/webp, image/heic, image/heif"
          className="hidden"
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-4">
            <Loader2 className="w-10 h-10 text-[#0B6839] animate-spin" />
            <p className="font-mono text-xs font-bold text-[#0B6839]">
              Processing photo...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3 py-2">
            <div className="w-14 h-14 rounded-full bg-[#0B6839]/10 text-[#0B6839] flex items-center justify-center border border-[#0B6839]">
              <Upload className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-heading-hero text-xl font-bold text-[#0B6839]">
                Drop your photo here
              </h3>
              <p className="font-mono text-[11px] text-gray-600 mt-0.5 uppercase tracking-wider">
                Supports JPG, PNG, WEBP, HEIC
              </p>
            </div>

            <button
              type="button"
              className="px-5 py-2.5 bg-[#0B6839] text-[#FEE101] font-mono text-xs font-bold rounded-xl shadow-sm hover:bg-[#0B6839]/90 transition-transform active:scale-95"
            >
              Choose Photo File
            </button>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="mt-3 p-3 bg-red-50 border border-red-400 rounded-xl flex items-center space-x-2 text-red-700 font-mono text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
