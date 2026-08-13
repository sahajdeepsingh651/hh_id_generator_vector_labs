import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Video, X } from 'lucide-react';

export const Landing: React.FC = () => {
  const [showHypeModal, setShowHypeModal] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#026834] text-white flex flex-col justify-between overflow-hidden selection:bg-[#FEE101] selection:text-[#026834]">
      {/* Background Halftone Grid & Radial Blur Orbs */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#FEE101_1px,transparent_1px)] [background-size:24px_24px]" />
      
      {/* Radial Orbs */}
      <div className="absolute -top-32 left-1/4 w-96 h-96 bg-[#FEE101]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-[#FF007A]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header Navigation */}
      <header className="relative z-30 px-6 sm:px-12 py-6 flex items-center justify-between">
        {/* Logo Left */}
        <Link to="/" className="font-mono text-xl sm:text-2xl font-bold tracking-widest text-[#FEE101]">
          2:47PM<span className="block text-xs font-normal text-white">STUDIO</span>
        </Link>

        {/* Navigation Buttons */}
        <div className="flex items-center space-x-6">
          <button
            type="button"
            onClick={() => setShowHypeModal(true)}
            className="font-mono text-sm sm:text-base font-bold text-white hover:text-[#FEE101] tracking-widest transition-colors hidden sm:flex items-center space-x-1"
          >
            <Video className="w-4 h-4 mr-1 text-[#FEE101]" />
            <span>CHECK HYPE</span>
          </button>

          <Link
            to="/generate"
            className="pattern-border-btn px-6 py-2.5 text-sm sm:text-base tracking-widest font-extrabold uppercase rounded-none inline-flex items-center space-x-2"
          >
            <span>CREATE</span>
          </Link>
        </div>
      </header>

      {/* Hero Content Section */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-8 py-12 space-y-8">
        
        {/* Main Banner Graphic with Floating Hindi Stamp */}
        <div className="relative inline-block max-w-4xl mx-auto">
          {/* Serif Title */}
          <h1 className="font-heading-hero text-6xl sm:text-8xl md:text-9xl font-black text-[#FEE101] tracking-tight leading-none drop-shadow-[0_4px_30px_rgba(254,225,1,0.4)]">
            HACKER HOUSE
          </h1>

          {/* Floating Hindi Stamp */}
          <div className="absolute top-1/2 left-[56%] -translate-x-1/2 -translate-y-1/2 rotate-6 transform goa-hindi-floating">
            <span className="goa-hindi-stamp text-5xl sm:text-7xl md:text-8xl font-black">
              गोवा
            </span>
          </div>
        </div>

        {/* Translucent Subbar Pill */}
        <div className="w-full max-w-3xl mx-auto bg-[#011208]/70 backdrop-blur-md border border-[#FEE101]/30 rounded-2xl px-6 py-3.5 flex items-center justify-between font-mono text-xs sm:text-sm font-bold text-[#FEE101] shadow-xl tracking-wider">
          <span>GOA, INDIA • 28 - 31 OCT 2026</span>
          <span className="hidden sm:inline">2:47 PM STUDIO</span>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Link
            to="/generate"
            className="pattern-border-btn px-10 py-4 text-lg sm:text-xl tracking-widest font-extrabold uppercase rounded-none shadow-2xl inline-flex items-center space-x-3"
          >
            <Sparkles className="w-6 h-6 text-[#FF007A]" />
            <span>Generate Your Builder Pass</span>
          </Link>
        </div>
      </main>

      {/* Footer Bar */}
      <footer className="relative z-20 px-6 py-6 text-center font-mono text-xs text-white/90 space-y-1">
        <div className="flex flex-wrap items-center justify-center space-x-3 text-emerald-400 font-bold">
          <span>#FrameInGoa</span>
          <span className="text-white/40">•</span>
          <span className="text-white">HH GOA 2026</span>
          <span className="text-white/40">•</span>
          <span className="text-white">August 28–31, 2026</span>
          <span className="text-white/40">•</span>
          <span className="text-white">Goa, India</span>
        </div>
        <p className="text-[11px] text-white/60">
          Built for HH Goa 2026 builders & attendees.
        </p>
      </footer>

      {/* Check Hype Modal */}
      {showHypeModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-[#011008] border-2 border-[#FEE101] rounded-2xl overflow-hidden shadow-2xl space-y-4 p-4 text-center">
            <button
              onClick={() => setShowHypeModal(false)}
              className="absolute top-4 right-4 text-white hover:text-[#FF007A] p-2"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="font-mono text-xl font-bold text-[#FEE101] pt-2">
              HH GOA 2026 — HYPE REEL
            </h3>

            <div className="aspect-video w-full bg-black rounded-xl overflow-hidden flex items-center justify-center">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Hacker House Goa Hype Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
