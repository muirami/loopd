import React from 'react';
import { Icons } from './Icons';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  triggerReason: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onUpgrade, triggerReason }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-slide-up relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 bg-gray-100 p-1 rounded-full text-gray-500 hover:bg-gray-200"
        >
          <Icons.X size={20} />
        </button>

        {/* Header */}
        <div className="bg-loopd-primary/10 p-8 text-center pt-10">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-orange-200">
            <Icons.Crown size={32} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Unlock Loopd Pro</h2>
          <p className="text-sm text-loopd-primary font-bold mt-1 uppercase tracking-wide">Unlimited Possibilities</p>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600 text-center mb-6">
            {triggerReason}
          </p>

          <div className="space-y-4 mb-8">
            <FeatureRow text="Unlimited availability windows" />
            <FeatureRow text="Unlimited circles & friends" />
            <FeatureRow text="Smart AI schedule suggestions" />
            <FeatureRow text="Sync with Google/Apple Calendar" />
          </div>

          <button 
            onClick={onUpgrade}
            className="w-full bg-gradient-to-r from-loopd-primary to-orange-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Icons.Zap size={20} fill="currentColor" />
            Try Pro Free (Beta)
          </button>
          
          <p className="text-xs text-center text-gray-400 mt-4">
            No credit card required during testing.
          </p>
        </div>
      </div>
    </div>
  );
};

const FeatureRow = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3">
    <div className="bg-green-100 text-green-600 rounded-full p-0.5">
      <Icons.Check size={14} />
    </div>
    <span className="text-sm font-medium text-gray-700">{text}</span>
  </div>
);
