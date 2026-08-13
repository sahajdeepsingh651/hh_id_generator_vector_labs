import React, { useEffect, useRef } from 'react';
import type { Area } from 'react-easy-crop';
import { drawCompositeCanvas } from '../lib/canvasCompositor';

interface FramePreviewProps {
  imageElement: HTMLImageElement | null;
  cropAreaPixels: Area | null;
  name: string;
  builderTitle: string;
  traits: string[];
  stackRole: string;
  passId?: string;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export const FramePreview: React.FC<FramePreviewProps> = ({
  imageElement,
  cropAreaPixels,
  name,
  builderTitle,
  traits,
  stackRole,
  passId,
  onCanvasReady,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      drawCompositeCanvas(canvasRef.current, {
        photoImage: imageElement,
        cropAreaPixels,
        userName: name,
        builderTitle,
        traits,
        stackRole,
        passId,
      });

      if (onCanvasReady) {
        onCanvasReady(canvasRef.current);
      }
    }
  }, [imageElement, cropAreaPixels, name, builderTitle, traits, stackRole, passId, onCanvasReady]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-h-[58vh] sm:max-h-[65vh] lg:max-h-[calc(100vh-130px)] my-auto">
      {/* Pass Card Wrapper bounded by screen height */}
      <div className="relative border-3 sm:border-4 border-[#FEE101]/60 rounded-2xl sm:rounded-3xl overflow-hidden w-auto h-full aspect-[1024/1536] bg-[#012010] shadow-xl sm:shadow-2xl flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain block rounded-xl sm:rounded-2xl"
        />
      </div>
    </div>
  );
};
