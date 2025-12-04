import React from 'react';
import { User, AvailabilityWindow, Hangout, HangoutStatus, Child, PlanType } from '../types';
import { Icons } from '../components/Icons';
import { BETA_MODE } from '../constants';

interface HomeProps {
  user: User;
  windows: AvailabilityWindow[];
  hangouts: Hangout[];
  kids: Child[];
  onUpgrade: () => void;
}

export const Home: React.FC<HomeProps> = ({ user, windows, hangouts, kids, onUpgrade }) => {
  // Filter for today's data (simplified for MVP as static "today")
  const todayWindows = windows.filter(w => w.day === 'Fri'); // Mocking today is Friday
  const upcomingHangouts = hangouts.filter(h => h.status !== HangoutStatus.CANCELLED);
  const isFree = user.plan === PlanType.FREE;

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-loopd-dark">Good morning, {user.name.split(' ')[0]}</h1>
          <p className="text-sm text-gray-500 mt-1">Ready for a simplified Friday?</p>
        </div>
        <div className="relative">
           <img src={user.avatarUrl} alt="Profile" className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover" />
           {BETA_MODE && (
             <div className="absolute -top-1 -right-1 bg-yellow-400 text-[8px] font-bold px-1.5 py-0.5 rounded-full text-yellow-900 border border-white">BETA</div>
           )}
           <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
        </div>
      </div>

      {/* Upgrade Banner (Only if NOT beta and user is FREE) */}
      {!BETA_MODE && isFree && (
         <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 text-white flex items-center justify-between shadow-lg">
            <div>
               <h3 className="font-bold text-sm flex items-center gap-2">
                 <Icons.Crown size={14} className="text-yellow-400" fill="currentColor"/>
                 Unlock Full Power
               </h3>
               <p className="text-xs text-gray-300 mt-1">Get unlimited windows & smart AI.</p>
            </div>
            <button onClick={onUpgrade} className="bg-white text-gray-900 text-xs font-bold px-3 py-2 rounded-lg">
              Upgrade
            </button>
         </div>
      )}

      {/* Action Requests */}
      {upcomingHangouts.some(h => h.status === HangoutStatus.PROPOSED && !h.invitedUserIds.includes(user.id)) && (
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-loopd-primary flex items-start gap-4">
          <div className="p-2 bg-loopd-primary/10 rounded-lg text-loopd-primary">
            <Icons.Sparkles size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800">New Hangout Invite</h3>
            <p className="text-sm text-gray-500">Emily wants to hang out this Saturday.</p>
            <div className="mt-3 flex gap-2">
              <button className="px-4 py-1.5 bg-loopd-primary text-white text-xs font-bold rounded-lg">View</button>
              <button className="px-4 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg">Dismiss</button>
            </div>
          </div>
        </div>
      )}

      {/* Today's Open Windows */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-loopd-dark">Your Open Windows Today</h2>
          <button className="text-loopd-primary text-sm font-semibold">Edit</button>
        </div>
        
        {todayWindows.length > 0 ? (
          <div className="space-y-3">
            {todayWindows.map(window => (
              <div key={window.id} className="bg-gradient-to-r from-green-50 to-white p-4 rounded-2xl border border-green-100 flex items-center justify-between relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-400"></div>
                <div>
                  <h3 className="font-bold text-gray-800">{window.title || 'Open to Hang'}</h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <Icons.Clock size={14} />
                    <span>{window.startTime} - {window.endTime}</span>
                  </div>
                </div>
                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm text-green-500">
                   <Icons.Check size={18} />
                </div>
              </div>
            ))}
          </div>
        ) : (
           <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 text-center">
             <p className="text-gray-400 text-sm">No windows set for today.</p>
           </div>
        )}
      </section>

      {/* Upcoming Hangs */}
      <section>
        <h2 className="text-lg font-bold text-loopd-dark mb-4">Upcoming Plans</h2>
        <div className="space-y-3">
          {upcomingHangouts.map(hangout => (
            <div key={hangout.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                   <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${hangout.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {hangout.status}
                    </span>
                    <span className="text-xs text-gray-400">In 2 days</span>
                   </div>
                   <h3 className="font-bold text-gray-800 text-lg">Coffee at {hangout.location}</h3>
                   <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <Icons.Clock size={14} />
                    <span>{new Date(hangout.date).toLocaleDateString()} • {hangout.startTime}</span>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">You</div>
                  <div className="w-8 h-8 rounded-full bg-loopd-accent border-2 border-white flex items-center justify-center text-xs font-bold text-loopd-primary">EC</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Kids Quick View */}
      <section>
         <h2 className="text-lg font-bold text-loopd-dark mb-4">Kids' Schedule Today</h2>
         <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {kids.map(child => {
              // Simple mock check for activity today
              const todayActivity = child.activities.find(a => a.day === 'Fri');
              return (
                <div key={child.id} className="min-w-[140px] bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${child.color.split(' ')[0].replace('bg-', 'bg-')}`}></div>
                    <span className="font-bold text-sm">{child.name}</span>
                  </div>
                  {todayActivity ? (
                     <div className="bg-gray-50 rounded-lg p-2">
                       <p className="text-xs font-semibold truncate">{todayActivity.name}</p>
                       <p className="text-[10px] text-gray-500">{todayActivity.startTime}-{todayActivity.endTime}</p>
                     </div>
                  ) : (
                    <p className="text-xs text-gray-400">Nothing scheduled</p>
                  )}
                </div>
              )
            })}
         </div>
      </section>
    </div>
  );
};
