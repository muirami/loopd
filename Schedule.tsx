import React, { useState } from 'react';
import { User, Child, AvailabilityWindow, DayOfWeek, ChildActivity } from '../types';
import { Icons } from '../components/Icons';
import { DAYS_ORDER, BETA_MODE } from '../constants';
import { parseActivityFromText } from '../services/geminiService';

interface ScheduleProps {
  user: User;
  kids: Child[];
  windows: AvailabilityWindow[];
  onAddWindow: (window: Omit<AvailabilityWindow, 'id'>) => void;
  onAddChildActivity: (childId: string, activity: Omit<ChildActivity, 'id'>) => void;
  checkAccess: (feature: string, currentCount?: number) => boolean;
}

export const Schedule: React.FC<ScheduleProps> = ({ 
  user, kids, windows, onAddWindow, onAddChildActivity, checkAccess 
}) => {
  const [activeTab, setActiveTab] = useState<'windows' | 'kids'>('windows');
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [geminiInput, setGeminiInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Group windows by day
  const windowsByDay = windows.reduce((acc, curr) => {
    if (!acc[curr.day]) acc[curr.day] = [];
    acc[curr.day].push(curr);
    return acc;
  }, {} as Record<DayOfWeek, AvailabilityWindow[]>);

  const handleGeminiAdd = async () => {
    if (!checkAccess('smartSuggestions')) return; // Gated Feature

    if (!geminiInput || kids.length === 0) return;
    setIsProcessing(true);
    const activity = await parseActivityFromText(geminiInput);
    if (activity) {
      onAddChildActivity(kids[0].id, activity);
      setGeminiInput('');
      setIsAddingActivity(false);
    } else {
      alert("Could not understand schedule. Try: 'Soccer on Monday 4pm to 5pm'");
    }
    setIsProcessing(false);
  };

  const handleAddWindowClick = () => {
    if (checkAccess('maxWindows', windows.length)) {
       // Mock adding a window for demo purposes
       onAddWindow({
         userId: user.id,
         day: DayOfWeek.Sat,
         startTime: '09:00',
         endTime: '11:00',
         isActive: true,
         title: 'New Weekend Window'
       });
    }
  };

  return (
    <div className="p-6 pb-24">
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl mb-6">
        <button
          onClick={() => setActiveTab('windows')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'windows' ? 'bg-white shadow-sm text-loopd-primary' : 'text-gray-500'
          }`}
        >
          My Windows
        </button>
        <button
          onClick={() => setActiveTab('kids')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'kids' ? 'bg-white shadow-sm text-loopd-primary' : 'text-gray-500'
          }`}
        >
          Kids' Schedule
        </button>
      </div>

      {activeTab === 'windows' ? (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-end">
            <h2 className="text-xl font-bold text-loopd-dark">Recurring Availability</h2>
            <div className="text-right">
               {BETA_MODE && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">UNLIMITED</span>}
               <p className="text-xs text-gray-400 mt-1">Auto-repeats weekly</p>
            </div>
          </div>

          {DAYS_ORDER.map(day => {
             const dayWindows = windowsByDay[day] || [];
             if (dayWindows.length === 0) return null;

             return (
               <div key={day} className="border-l-2 border-gray-100 pl-4 py-2">
                 <h3 className="font-bold text-gray-400 mb-2 uppercase text-xs tracking-wider">{day}</h3>
                 <div className="space-y-3">
                   {dayWindows.map(w => (
                     <div key={w.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
                        <div>
                          <div className="font-bold text-gray-800">{w.title}</div>
                          <div className="text-sm text-loopd-primary font-medium">{w.startTime} - {w.endTime}</div>
                        </div>
                        <button className="text-gray-300 hover:text-red-400">
                          <Icons.More size={20} />
                        </button>
                     </div>
                   ))}
                 </div>
               </div>
             )
          })}

          <button 
            onClick={handleAddWindowClick}
            className="w-full py-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 font-bold flex items-center justify-center gap-2 hover:border-loopd-primary hover:text-loopd-primary transition-colors hover:bg-loopd-primary/5"
          >
            <Icons.Plus size={20} />
            Add Availability Window
          </button>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
           <div className="flex justify-between items-center">
             <h2 className="text-xl font-bold text-loopd-dark">Kids Activities</h2>
             <button 
               onClick={() => {
                 if(checkAccess('smartSuggestions')) setIsAddingActivity(!isAddingActivity);
               }}
               className="text-loopd-primary text-sm font-bold flex items-center gap-1"
              >
               <Icons.Sparkles size={16} />
               Smart Add
               {!BETA_MODE && <Icons.Lock size={12} className="text-gray-400"/>}
             </button>
           </div>

           {isAddingActivity && (
             <div className="bg-loopd-secondary/10 p-4 rounded-xl border border-loopd-secondary/20 mb-4 animate-slide-up">
               <label className="text-xs font-bold text-loopd-secondary uppercase mb-2 block flex items-center justify-between">
                 <span>Magic Parser</span>
                 <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-loopd-secondary">PRO</span>
               </label>
               <textarea 
                  className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-loopd-secondary"
                  rows={3}
                  placeholder="e.g. Leo has Soccer practice every Tuesday from 4pm to 5pm at the city oval."
                  value={geminiInput}
                  onChange={(e) => setGeminiInput(e.target.value)}
               />
               <button 
                onClick={handleGeminiAdd}
                disabled={isProcessing}
                className="mt-3 w-full bg-loopd-secondary text-white font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-2"
               >
                 {isProcessing ? 'Thinking...' : 'Add to Schedule'}
                 {!isProcessing && <Icons.Sparkles size={16} />}
               </button>
               {BETA_MODE && <p className="text-[10px] text-center text-loopd-secondary/70 mt-2">Free to use during Beta!</p>}
             </div>
           )}

           {kids.map(child => (
             <div key={child.id}>
                <div className="flex items-center gap-2 mb-3">
                   <div className={`w-3 h-3 rounded-full ${child.color.split(' ')[0]}`}></div>
                   <h3 className="font-bold text-lg text-gray-800">{child.name}</h3>
                </div>
                <div className="space-y-2 pl-5">
                  {child.activities.map(activity => (
                    <div key={activity.id} className="bg-white p-3 rounded-lg border border-gray-100 flex items-center gap-4">
                       <div className="bg-gray-50 w-12 h-12 rounded-lg flex flex-col items-center justify-center text-xs font-bold text-gray-400">
                          <span>{activity.day.slice(0,3)}</span>
                       </div>
                       <div>
                         <div className="font-bold text-gray-700">{activity.name}</div>
                         <div className="text-xs text-gray-500">{activity.startTime} - {activity.endTime}</div>
                       </div>
                    </div>
                  ))}
                  {child.activities.length === 0 && <p className="text-gray-400 text-sm italic">No activities added yet.</p>}
                  
                  <button 
                    onClick={() => {
                       // Mock basic add
                       if(checkAccess('maxChildren', kids.length)) {
                         // Add logic
                         alert("Manual add coming soon");
                       }
                    }}
                    className="w-full mt-2 py-2 border border-dashed border-gray-200 rounded-lg text-xs font-bold text-gray-400 hover:text-gray-600 hover:border-gray-300"
                  >
                    + Add Activity Manually
                  </button>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};
