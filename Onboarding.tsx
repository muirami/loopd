
import React, { useState, useEffect } from 'react';
import { Icons } from '../components/Icons';

interface OnboardingProps {
  onComplete: () => void;
}

type SetupMethod = 'manual' | 'calendar' | null;
type PrivacySetting = 'smart' | 'curated' | null;

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<SetupMethod>(null);
  const [privacy, setPrivacy] = useState<PrivacySetting>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Step 1: Welcome
  // Step 2: Choose Method (Manual vs Calendar)
  // Step 3: Calendar Privacy (If Calendar chosen)
  // Step 4: Set Windows (If Manual OR Curated Privacy chosen)
  // Step 5: Complete

  const handleMethodSelect = (selectedMethod: SetupMethod) => {
    setMethod(selectedMethod);
    if (selectedMethod === 'calendar') {
      setIsSyncing(true);
      // Simulate sync delay
      setTimeout(() => {
        setIsSyncing(false);
        setStep(3); // Go to Privacy
      }, 1500);
    } else {
      setStep(4); // Go to Manual Windows
    }
  };

  const handlePrivacySelect = (selectedPrivacy: PrivacySetting) => {
    setPrivacy(selectedPrivacy);
    if (selectedPrivacy === 'smart') {
      setStep(5); // Skip manual windows, go to done
    } else {
      setStep(4); // Go to window selection to curate times
    }
  };

  return (
    <div className="h-full flex flex-col justify-between p-8 pt-12 bg-gradient-to-b from-white to-loopd-base">
      <div className="flex-1 flex flex-col items-center text-center">
        
        {/* STEP 1: WELCOME */}
        {step === 1 && (
          <div className="animate-fade-in mt-10">
            <div className="w-20 h-20 bg-loopd-accent rounded-full flex items-center justify-center mb-8 mx-auto text-loopd-primary shadow-lg shadow-orange-100">
              <Icons.Sparkles size={40} />
            </div>
            <h1 className="text-3xl font-bold text-loopd-dark mb-4">Welcome to Loopd</h1>
            <p className="text-lg text-gray-500 leading-relaxed mb-8">
              Life in sync. No more endless group texts. Just share when you're open to hang, and let the fun happen.
            </p>
            <div className="flex gap-2 justify-center">
              <div className="w-2 h-2 rounded-full bg-loopd-primary"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            </div>
          </div>
        )}

        {/* STEP 2: CHOOSE METHOD */}
        {step === 2 && (
          <div className="animate-fade-in w-full mt-4">
            <h2 className="text-2xl font-bold text-loopd-dark mb-2">Get setup</h2>
            <p className="text-gray-500 mb-8">How should we find your free time?</p>

            {isSyncing ? (
               <div className="flex flex-col items-center justify-center h-48">
                 <Icons.Loader className="animate-spin text-loopd-primary mb-4" size={48} />
                 <p className="font-bold text-gray-600">Syncing calendar...</p>
               </div>
            ) : (
              <div className="space-y-4">
                <button 
                  onClick={() => handleMethodSelect('calendar')}
                  className="w-full bg-white p-6 rounded-2xl shadow-sm border-2 border-transparent hover:border-loopd-primary hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Icons.Smartphone size={24} />
                    </div>
                    <span className="font-bold text-lg text-gray-800">Connect Phone Calendar</span>
                  </div>
                  <p className="text-sm text-gray-500 pl-16">
                    We'll scan for free slots. You choose what to share.
                  </p>
                </button>

                <button 
                  onClick={() => handleMethodSelect('manual')}
                  className="w-full bg-white p-6 rounded-2xl shadow-sm border-2 border-transparent hover:border-loopd-primary hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                      <Icons.Calendar size={24} />
                    </div>
                    <span className="font-bold text-lg text-gray-800">Set Manually</span>
                  </div>
                  <p className="text-sm text-gray-500 pl-16">
                    I'll pick specific recurring windows myself.
                  </p>
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: CALENDAR PRIVACY */}
        {step === 3 && (
          <div className="animate-fade-in w-full mt-4">
             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto text-blue-600">
              <Icons.Shield size={32} />
            </div>
            <h2 className="text-2xl font-bold text-loopd-dark mb-2">Privacy Settings</h2>
            <p className="text-gray-500 mb-8">How much availability do you want to show?</p>

            <div className="space-y-4">
              <button 
                onClick={() => handlePrivacySelect('smart')}
                className="w-full bg-white p-5 rounded-2xl shadow-sm border-2 border-transparent hover:border-loopd-primary hover:shadow-md transition-all text-left relative overflow-hidden"
              >
                <div className="flex items-start gap-4 z-10 relative">
                  <div className="mt-1 text-loopd-primary">
                    <Icons.Globe size={24} />
                  </div>
                  <div>
                    <span className="font-bold text-lg text-gray-800 block">Smart Availability</span>
                    <p className="text-sm text-gray-500 mt-1">
                      Show "Busy" when you have plans, and "Free" when you don't. <br/>
                      <span className="text-xs text-blue-500 font-bold mt-1 inline-block">Recommended for close circles</span>
                    </p>
                  </div>
                </div>
              </button>

              <button 
                onClick={() => handlePrivacySelect('curated')}
                className="w-full bg-white p-5 rounded-2xl shadow-sm border-2 border-transparent hover:border-loopd-primary hover:shadow-md transition-all text-left"
              >
                <div className="flex items-start gap-4">
                   <div className="mt-1 text-gray-400">
                    <Icons.Lock size={24} />
                  </div>
                  <div>
                    <span className="font-bold text-lg text-gray-800 block">Curated Windows</span>
                    <p className="text-sm text-gray-500 mt-1">
                      Only show "Free" during specific times you choose (e.g. Weekends). Everything else shows "Busy".
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SET WINDOWS (Manual or Curated) */}
        {step === 4 && (
          <div className="animate-fade-in w-full">
             <div className="w-20 h-20 bg-loopd-secondary/30 rounded-full flex items-center justify-center mb-6 mx-auto text-loopd-secondary">
              <Icons.Clock size={40} />
            </div>
            <h2 className="text-2xl font-bold text-loopd-dark mb-2">
              {privacy === 'curated' ? 'Curate your windows' : 'Set your windows'}
            </h2>
            <p className="text-gray-500 mb-6">
              {privacy === 'curated' 
                ? 'Since you chose curated mode, pick the recurring times you are generally open to hang.' 
                : 'Pick 2-3 recurring times you\'re usually free.'}
            </p>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-left mb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="font-bold text-gray-700">Friday After School</span>
              </div>
              <p className="text-sm text-gray-500 ml-5">Weekly • 3:00 PM - 5:00 PM</p>
            </div>
             <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-left opacity-60">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span className="font-bold text-gray-700">Sunday Morning Park</span>
              </div>
              <p className="text-sm text-gray-500 ml-5">Weekly • 9:30 AM - 11:30 AM</p>
            </div>
          </div>
        )}

        {/* STEP 5: DONE */}
        {step === 5 && (
          <div className="animate-fade-in w-full mt-10">
             <div className="w-24 h-24 bg-loopd-primary/10 rounded-full flex items-center justify-center mb-8 mx-auto text-loopd-primary relative">
              <Icons.Heart size={48} className="animate-pulse" />
              <div className="absolute top-0 right-0">
                <Icons.Check size={32} className="text-green-500 bg-white rounded-full border-4 border-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-loopd-dark mb-4">You're all set!</h2>
            <p className="text-gray-500 mb-8 px-4">
              {method === 'calendar' 
                ? "Your calendar is synced. We'll handle the busy work so you can focus on the fun."
                : "Your windows are set. You can always change them later in your schedule tab."}
            </p>
          </div>
        )}
      </div>

      <div className="flex-none pb-8">
        {step === 1 && (
          <button onClick={() => setStep(2)} className="w-full bg-loopd-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-loopd-primary/30 flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all">
            Get Started <Icons.ChevronRight size={20} />
          </button>
        )}
        {/* Step 2 & 3 have inline buttons */}
        
        {step === 4 && (
          <button onClick={() => setStep(5)} className="w-full bg-loopd-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-loopd-primary/30 flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all">
            Looks Good <Icons.Check size={20} />
          </button>
        )}

        {step === 5 && (
          <button onClick={onComplete} className="w-full bg-loopd-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-gray-400/30 flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all">
            Enter Loopd
          </button>
        )}
      </div>
    </div>
  );
};
