import React from 'react';
import { User, Code2, Sparkles, Shuffle } from 'lucide-react';

interface DetailsFormProps {
  name: string;
  setName: (name: string) => void;
  stackRole: string;
  setStackRole: (role: string) => void;
  builderTitle: string;
  traits: string[];
  onRegenerateTraits: () => void;
}

const STACK_PRESETS = [
  "Frontend / React",
  "Backend / Python",
  "Fullstack / Node",
  "AI / ML Engineer",
  "Smart Contract",
  "UI/UX Design",
  "DevRel / Hacker"
];

export const DetailsForm: React.FC<DetailsFormProps> = ({
  name,
  setName,
  stackRole,
  setStackRole,
  builderTitle,
  traits,
  onRegenerateTraits,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto space-y-3">
      <div className="border-b border-[#063725]/15 pb-2">
        <h3 className="font-heading-hero text-xl font-bold text-[#063725]">
          Builder Details
        </h3>
        <p className="font-mono text-[11px] text-gray-600 uppercase tracking-wider mt-0.5">
          Customize your Goan Adventurer identity plaque
        </p>
      </div>

      {/* Name Input */}
      <div className="space-y-1">
        <label className="block font-mono text-[11px] font-bold text-[#063725] uppercase tracking-wider">
          <User className="w-3.5 h-3.5 inline mr-1" />
          Full Name / Handle <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Satoshi Nakamoto"
          className="w-full px-3 py-2 rounded-xl border-2 border-[#063725]/30 bg-[#FFF8EB] font-mono text-xs focus:outline-none focus:border-[#063725]"
        />
      </div>

      {/* Stack/Role Input */}
      <div className="space-y-1">
        <label className="block font-mono text-[11px] font-bold text-[#063725] uppercase tracking-wider">
          <Code2 className="w-3.5 h-3.5 inline mr-1" />
          Stack / Primary Role <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={stackRole}
          onChange={(e) => setStackRole(e.target.value)}
          placeholder="e.g. Frontend / React + Tailwind"
          className="w-full px-3 py-2 rounded-xl border-2 border-[#063725]/30 bg-[#FFF8EB] font-mono text-xs focus:outline-none focus:border-[#063725]"
        />

        {/* Quick Presets */}
        <div className="pt-1">
          <div className="flex flex-wrap gap-1.5">
            {STACK_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setStackRole(preset)}
                className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold transition-all ${
                  stackRole === preset
                    ? 'bg-[#063725] text-[#FEE101]'
                    : 'bg-[#FFF8EB] text-[#063725] border border-[#063725]/30 hover:border-[#063725]'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generated Title & Traits Preview */}
      <div className="p-3 bg-[#011A0D] text-[#FFF8EB] rounded-xl border border-[#FEE101]/40 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] font-bold text-[#FEE101] flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AUTO-GENERATED TITLE</span>
          </span>

          <button
            type="button"
            onClick={onRegenerateTraits}
            className="text-[10px] font-mono text-[#9AC95F] hover:text-[#FEE101] flex items-center space-x-1 underline cursor-pointer"
          >
            <Shuffle className="w-3 h-3" />
            <span>Shuffle Traits</span>
          </button>
        </div>

        <div className="font-heading-hero text-lg text-[#FEE101] tracking-wide text-center">
          "{builderTitle}"
        </div>

        {/* Trait badges */}
        <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-gray-800">
          {traits.map((trait, i) => (
            <div
              key={i}
              className="bg-[#026834]/60 px-2 py-0.5 rounded font-mono text-[10px] text-white flex items-center space-x-1"
            >
              <span className="text-[#FEE101]">✦</span>
              <span className="truncate">{trait}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
