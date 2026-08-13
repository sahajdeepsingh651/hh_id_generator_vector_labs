import React, { useState, useEffect } from 'react';
import type { Area } from 'react-easy-crop';
import { UploadStep } from '../components/UploadStep';
import { CropStep } from '../components/CropStep';
import { DetailsForm } from '../components/DetailsForm';
import { FramePreview } from '../components/FramePreview';
import { ShareModal } from '../components/ShareModal';
import { getTitleAndTraits } from '../lib/titleGenerator';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Generator: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // User input states
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [cropAreaPixels, setCropAreaPixels] = useState<Area | null>(null);
  const [name, setName] = useState<string>('');
  const [stackRole, setStackRole] = useState<string>('FRONTEND / UI DESIGNER');
  const [builderTitle, setBuilderTitle] = useState<string>('TERMINAL WIZARD');
  const [traits, setTraits] = useState<string[]>([]);
  const [passId, setPassId] = useState<string>('');

  // Client-side canvas reference
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null);

  // Initialize random Pass ID and Title
  useEffect(() => {
    setPassId(`HH-GOA-${Math.floor(1000 + Math.random() * 9000)}`);
  }, []);

  // Update title & traits when stackRole changes.
  // `name` is deliberately NOT a dependency: getTitleAndTraits picks randomly,
  // so re-running it per keystroke re-rolled the title and traits on every letter typed.
  useEffect(() => {
    if (stackRole) {
      const res = getTitleAndTraits(stackRole, name);
      setBuilderTitle(res.builderTitle);
      setTraits(res.traits);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stackRole]);

  const handleImageSelected = (img: HTMLImageElement) => {
    setImageElement(img);
    setStep(2);
  };

  const handleRegenerateTraits = () => {
    const res = getTitleAndTraits(stackRole || 'Developer', name);
    setBuilderTitle(res.builderTitle);
    setTraits(res.traits);
  };

  const handleGenerateFinal = () => {
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setImageElement(null);
    setCropAreaPixels(null);
    setName('');
    setPassId(`HH-GOA-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden bg-[#FFF8EB] text-[#063725] flex flex-col selection:bg-[#FEE101] selection:text-[#063725]">
      
      {/* App Header */}
      <header className="w-full bg-[#063725] text-[#FFF8EB] border-b-4 border-[#FEE101] px-6 py-2.5 shrink-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#FEE101] text-[#063725] flex items-center justify-center font-bold text-base">
              🌴
            </div>
            <div>
              <div className="font-sans font-black text-base text-[#FEE101] tracking-wider leading-tight">
                HACKER GOA HOUSE
              </div>
              <div className="font-sans text-[10px] text-white/80">
                Builder Social Card Generator
              </div>
            </div>
          </Link>

          <Link
            to="/"
            className="font-mono text-xs text-[#FEE101] hover:text-white flex items-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>HOME</span>
          </Link>
        </div>
      </header>

      {/* Generator Body: Perfectly aligned 2-column layout with 0 shadows */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 lg:h-[calc(100vh-60px)] lg:overflow-hidden flex items-center justify-center">
        
        {step < 4 ? (
          /* Steps 1, 2, 3 Grid Layout: Pass Card on LEFT, Form Controls on RIGHT */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-center lg:max-h-[calc(100vh-120px)] lg:overflow-hidden">
            
            {/* Left Side: Interactive Pass Card Preview */}
            <div className="lg:col-span-6 flex items-center justify-center lg:h-full lg:overflow-hidden">
              <FramePreview
                imageElement={imageElement}
                cropAreaPixels={cropAreaPixels}
                name={name}
                builderTitle={builderTitle}
                traits={traits}
                stackRole={stackRole}
                passId={passId}
                onCanvasReady={(c) => setCanvasElement(c)}
              />
            </div>

            {/* Right Side: Form Controls (No shadow, matching border and vertical centering) */}
            <div className="lg:col-span-6 flex flex-col justify-center lg:h-full lg:overflow-hidden">
              {step === 1 && (
                <div className="bg-white p-6 rounded-3xl border-4 border-[#063725] flex flex-col justify-between lg:h-full lg:max-h-[calc(100vh-130px)] lg:overflow-hidden">
                  <div className="text-center space-y-1">
                    <h2 className="font-sans font-black text-xl text-[#063725]">
                      Upload Your Photo
                    </h2>
                    <p className="font-sans text-xs text-gray-600">
                      Supports JPG, PNG, WEBP, and iPhone HEIC photos
                    </p>
                  </div>
                  <div className="flex-1 flex items-center justify-center my-auto">
                    <UploadStep onImageSelected={handleImageSelected} />
                  </div>
                </div>
              )}

              {step === 2 && imageElement && (
                <div className="bg-white p-6 rounded-3xl border-4 border-[#063725] flex flex-col justify-between lg:h-full lg:max-h-[calc(100vh-130px)] lg:overflow-hidden">
                  <div className="flex-1 flex flex-col justify-center space-y-3">
                    <CropStep
                      imageSrc={imageElement.src}
                      onCropComplete={(pixels) => setCropAreaPixels(pixels)}
                      onReupload={() => setStep(1)}
                    />
                  </div>
                  <button
                    onClick={() => setStep(3)}
                    className="w-full py-3.5 bg-[#063725] text-[#FEE101] border-2 border-[#063725] rounded-xl font-sans font-extrabold text-sm hover:bg-[#0a4f36] flex items-center justify-center space-x-2 shrink-0 mt-2"
                  >
                    <span>Next: Enter Name & Role</span>
                    <Sparkles className="w-4 h-4 text-[#FEE101]" />
                  </button>
                </div>
              )}

              {step === 3 && (
                <div className="bg-white p-6 rounded-3xl border-4 border-[#063725] flex flex-col justify-between lg:h-full lg:max-h-[calc(100vh-130px)] lg:overflow-hidden">
                  <div className="flex-1 flex flex-col justify-center my-auto">
                    <DetailsForm
                      name={name}
                      setName={setName}
                      stackRole={stackRole}
                      setStackRole={setStackRole}
                      builderTitle={builderTitle}
                      traits={traits}
                      onRegenerateTraits={handleRegenerateTraits}
                    />
                  </div>

                  <button
                    onClick={handleGenerateFinal}
                    disabled={!name.trim()}
                    className={`w-full py-3.5 rounded-xl font-sans font-extrabold text-sm flex items-center justify-center space-x-2 transition-all shrink-0 mt-2 ${
                      name.trim()
                        ? 'bg-[#063725] text-[#FEE101] hover:bg-[#0a4f36] cursor-pointer'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Final Builder Pass</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        ) : (
          /* Step 4 Final Pass View Layout: Pass Card on LEFT (col-span-7), Vertical Buttons Box on RIGHT (col-span-5) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-center lg:max-h-[calc(100vh-120px)] lg:overflow-hidden">
            
            {/* Left Side: Pass Card Preview */}
            <div className="lg:col-span-7 flex items-center justify-center lg:h-full lg:overflow-hidden">
              <FramePreview
                imageElement={imageElement}
                cropAreaPixels={cropAreaPixels}
                name={name}
                builderTitle={builderTitle}
                traits={traits}
                stackRole={stackRole}
                passId={passId}
                onCanvasReady={(c) => setCanvasElement(c)}
              />
            </div>

            {/* Right Side: Vertical Action Buttons Box (No Shadow, matching border) */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border-4 border-[#063725] flex flex-col justify-between items-center gap-6 lg:gap-0 lg:h-full lg:max-h-[calc(100vh-130px)] lg:overflow-hidden">
              <div className="text-center space-y-2 my-auto">
                <span className="inline-block px-3.5 py-1 bg-[#E6F4EA] text-[#2E7D32] border border-[#2E7D32] rounded-full font-sans font-bold text-xs">
                  ✓ PASS CREATED
                </span>
                <h3 className="font-sans font-extrabold text-3xl text-[#063725]">
                  Your Pass is Ready!
                </h3>
                <p className="font-sans text-xs text-gray-600 max-w-xs mx-auto">
                  Download or post directly to X with #FrameInGoa
                </p>
              </div>

              {/* Vertical Stacked Action Buttons */}
              <div className="w-full my-auto">
                <ShareModal
                  canvasElement={canvasElement}
                  name={name}
                  stackRole={stackRole}
                  builderTitle={builderTitle}
                  onReset={handleReset}
                />
              </div>

              <div className="text-[11px] font-sans font-semibold text-gray-500 text-center">
                HH Goa 2026 Official Builder Identity
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
};
