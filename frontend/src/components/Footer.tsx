import React from 'react';
import { Heart, Terminal, Share2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#121814] text-[#FBF8EE] border-t-4 border-[#0B6839] py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center space-x-2 text-[#FEE101] font-mono text-lg font-bold">
            <Terminal className="w-5 h-5" />
            <span>HH GOA 2026 — FOR DEVELOPERS WHO LIVE IN THEIR TERMINALS</span>
          </div>

          <p className="text-sm font-mono text-gray-300 max-w-xl">
            Generate your official Goan Adventurer badge, wrap your profile picture in Azulejo tile art, and share your builder identity with #FrameInGoa.
          </p>

          <div className="flex items-center justify-center space-x-6 text-sm font-mono text-[#9AC95F] pt-2">
            <span className="flex items-center space-x-1">
              <Share2 className="w-4 h-4 text-[#FEE101]" />
              <span>#FrameInGoa</span>
            </span>
            <span>•</span>
            <span>FastAPI + React</span>
            <span>•</span>
            <span>Azulejo Tile Engine</span>
          </div>

          <div className="text-xs text-gray-500 pt-6 border-t border-gray-800 w-full max-w-md">
            © 2026 HH Goa. Made with <Heart className="w-3.5 h-3.5 inline text-red-500 fill-red-500 mx-0.5" /> in Goa, India.
          </div>
        </div>
      </div>
    </footer>
  );
};
