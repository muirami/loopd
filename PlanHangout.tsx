import React, { useState } from 'react';
import { User, AvailabilityWindow, DayOfWeek } from '../types';
import { Icons } from '../components/Icons';
import { suggestHangoutMessage } from '../services/geminiService';

interface PlanHangoutProps {
  currentUser: User;
  friends: User[];
  windows: AvailabilityWindow[]; // Current user windows
  onClose: () => void;
  onSubmit: (details: any) => void;
}

export const PlanHangout: React.FC<PlanHangoutProps> = ({ currentUser, friends, windows, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);
  const [selectedWindowId, setSelectedWindowId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleFriend = (id: string) => {
    if (selectedFriendIds.includes(id)) {
      setSelectedFriendIds(prev => prev.filter(fid => fid !== id));
    } else {
      setSelectedFriendIds(prev => [...prev, id]);
    }
  };

  const handleWindowSelect = async (win: AvailabilityWindow) => {
    setSelectedWindowId(win.id);
    setIsGenerating(true);
    // Use Gemini to draft a warm message
    const suggestion = await suggestHangoutMessage(currentUser.name, win.title || 'Playdate', 'the park');
    setMessage(suggestion);
    setIsGenerating(false);
    setStep(3);
  };

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col animate-slide-up">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
           <Icons.X size={24} />
        </button>
        <h2 className="font-bold text-lg">Plan a Hang</h2>
        <div className="w-6"></div> 
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {step === 1 && (
          <div>
            <h3 className="text-xl font-bold text-loopd-dark mb-4">Who are we seeing?</h3>
            <div className="space-y-3">
              {friends.map(friend => (
                <div 
                  key={friend.id}
                  onClick={() => toggleFriend(friend.id)}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedFriendIds.includes(friend.id) 
                      ? 'border-loopd-primary bg-loopd-primary/5' 
                      : 'border-gray-100 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                       {friend.name.charAt(0)}
                     </div>
                     <span className="font-bold text-gray-700">{friend.name}</span>
                  </div>
                  {selectedFriendIds.includes(friend.id) && <Icons.Check className="text-loopd-primary" size={20} />}
                </div>
              ))}
            </div>
            <button 
              disabled={selectedFriendIds.length === 0}
              onClick={() => setStep(2)}
              className="mt-8 w-full bg-loopd-dark text-white font-bold py-4 rounded-xl disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
             <h3 className="text-xl font-bold text-loopd-dark mb-4">Pick a window</h3>
             <p className="text-gray-500 mb-6 text-sm">Choose one of your open slots. We'll check if it works for them.</p>
             <div className="space-y-3">
                {windows.map(win => (
                  <div 
                    key={win.id}
                    onClick={() => handleWindowSelect(win)}
                    className="p-4 rounded-xl border border-gray-200 hover:border-loopd-primary cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-800">{win.title || "Open Window"}</span>
                      {win.day === 'Fri' && <span className="bg-green-100 text-green-700 text-[10px] px-2 rounded-full font-bold">This Friday</span>}
                    </div>
                    <div className="text-sm text-gray-500 flex gap-2">
                       <Icons.Clock size={16} />
                       {win.startTime} - {win.endTime}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-xl font-bold text-loopd-dark mb-4">Send Invite</h3>
            
            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Message</label>
              {isGenerating ? (
                 <div className="flex items-center gap-2 text-loopd-secondary text-sm">
                   <Icons.Sparkles size={16} className="animate-spin" />
                   Drafting friendly message...
                 </div>
              ) : (
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-transparent border-none p-0 text-gray-700 focus:ring-0 resize-none font-medium"
                  rows={3}
                />
              )}
            </div>

            <button 
              onClick={() => {
                onSubmit({ friendIds: selectedFriendIds, windowId: selectedWindowId, message });
                onClose();
              }}
              className="w-full bg-loopd-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-loopd-primary/30"
            >
              Send Invite
            </button>
          </div>
        )}
      </div>
    </div>
  );
};