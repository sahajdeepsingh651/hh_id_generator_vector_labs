import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Compass } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-[#0B6839] text-[#FEE101] border-b-4 border-[#FEE101] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-12 h-12 rounded-xl bg-[#FEE101] text-[#0B6839] flex items-center justify-center font-bold text-2xl shadow-md transform group-hover:rotate-6 transition-transform">
            🌴
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-heading-hero text-xl sm:text-2xl font-bold tracking-wider text-[#FEE101]">
                HH GOA 2026
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-mono font-semibold bg-[#9AC95F] text-[#121814] rounded-full">
                BUILDER BADGE
              </span>
            </div>
            <p className="text-xs font-mono text-[#FBF8EE] opacity-90 tracking-widest uppercase">
              Official PFP & ID Generator
            </p>
          </div>
        </Link>

        {/* Navigation CTAs */}
        <nav className="flex items-center space-x-4">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg font-mono text-sm font-semibold transition-all ${
              location.pathname === '/'
                ? 'bg-[#FEE101] text-[#0B6839]'
                : 'text-[#FBF8EE] hover:bg-[#0B6839]/80 hover:text-[#FEE101]'
            }`}
          >
            <span className="flex items-center space-x-1.5">
              <Compass className="w-4 h-4" />
              <span>Explore</span>
            </span>
          </Link>

          <Link
            to="/generate"
            className={`px-5 py-2.5 rounded-lg font-mono text-sm font-bold shadow-md transition-all transform hover:scale-105 active:scale-95 flex items-center space-x-2 ${
              location.pathname === '/generate'
                ? 'bg-[#FEE101] text-[#0B6839] ring-2 ring-[#FEE101]'
                : 'bg-[#FEE101] text-[#0B6839] hover:bg-white'
            }`}
          >
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span>Create Frame</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};
