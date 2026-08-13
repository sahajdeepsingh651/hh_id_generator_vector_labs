import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

interface CropStepProps {
  imageSrc: string;
  onCropComplete: (croppedAreaPixels: Area) => void;
  onReupload: () => void;
}

export const CropStep: React.FC<CropStepProps> = ({
  imageSrc,
  onCropComplete,
  onReupload,
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropChange = (crop: Point) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const handleCropCompleteInternal = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    onCropComplete(croppedAreaPixels);
  }, [onCropComplete]);

  return (
    <div className="w-full max-w-xl mx-auto space-y-3">
      <div className="text-center">
        <h3 className="font-heading-hero text-xl font-bold text-[#0B6839]">
          Position & Crop Your Photo
        </h3>
        <p className="font-mono text-[11px] text-gray-600 uppercase tracking-wider mt-0.5">
          Drag photo to align inside the circle
        </p>
      </div>

      {/* Compact Cropper Box */}
      <div className="relative w-full h-[200px] sm:h-[220px] bg-[#121814] rounded-2xl overflow-hidden border-3 border-[#0B6839]">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={handleCropCompleteInternal}
          cropShape="round"
          showGrid={false}
        />
      </div>

      {/* Compact Zoom Slider & Reupload Row */}
      <div className="bg-[#FFF8EB] border-2 border-[#0B6839]/30 rounded-xl p-2.5 flex items-center justify-between space-x-3">
        <div className="flex-1 flex items-center space-x-2">
          <button
            onClick={() => setZoom(Math.max(1, zoom - 0.2))}
            className="p-1 text-[#0B6839] hover:bg-[#0B6839]/10 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="font-mono text-[10px] font-bold text-[#0B6839]">ZOOM</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-[#0B6839] cursor-pointer h-1.5"
          />

          <button
            onClick={() => setZoom(Math.min(3, zoom + 0.2))}
            className="p-1 text-[#0B6839] hover:bg-[#0B6839]/10 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onReupload}
          className="px-3 py-1.5 bg-gray-200 text-gray-800 font-mono text-[11px] font-bold rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-1.5 flex-shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Change</span>
        </button>
      </div>
    </div>
  );
};
