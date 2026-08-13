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
    <div className="flex flex-col items-center justify-center w-full lg:h-full lg:max-h-[calc(100vh-130px)]">
      {/* Small screens: sized by width so the card can't collapse or overflow.
          lg and up: bounded by viewport height, as before. */}
      <div className="relative border-4 border-[#063725] rounded-3xl overflow-hidden w-full max-w-[280px] sm:max-w-[330px] lg:w-auto lg:max-w-none lg:h-full lg:max-h-[calc(100vh-130px)] aspect-[1024/1536] bg-[#FFF8EB] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain block rounded-2xl"
        />
      </div>
    </div>
  );
};
