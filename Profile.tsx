import React from 'react';
import { User, Subscription, PlanType } from '../types';
import { Icons } from '../components/Icons';
import { BETA_MODE } from '../constants';

interface ProfileProps {
  user: User;
  subscription: Subscription;
  onUpgrade: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, subscription, onUpgrade }) => {
  const isPro = subscription.planType === PlanType.PRO;

  return (
    <div className="p-6 pb-24">
      <h1 className="text-2xl font-bold text-loopd-dark mb-6">Profile & Settings</h1>
      
      {/* Profile Card */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center mb-6 relative overflow-hidden">
        {isPro && (
          <div className="absolute top-0 right-0 bg-gradient-to-bl from-yellow-300 to-orange-400 text-white px-4 py-1.5 rounded-bl-2xl text-xs font-bold flex items-center gap-1 shadow-sm">
            <Icons.Crown size={12} fill="currentColor" />
            {BETA_MODE ? 'PRO BETA' : 'PRO'}
          </div>
        )}
        
        <img src={user.avatarUrl} className="w-24 h-24 rounded-full mb-4 border-4 border-white shadow-lg" alt="Profile" />
        <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
        <p className="text-gray-500 mb-4">{user.email}</p>
        
        {BETA_MODE && (
           <div className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full font-bold mb-4">
             Beta Tester Access
           </div>
        )}
      </div>

      {/* Plan Details */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-3 px-2">Current Plan</h3>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
           <div>
             <div className="font-bold text-lg text-gray-800 flex items-center gap-2">
               Loopd {isPro ? 'Pro' : 'Free'}
               {isPro && <Icons.Crown size={16} className="text-yellow-500" fill="currentColor" />}
             </div>
             <p className="text-xs text-gray-400 mt-1">
               {isPro 
                 ? BETA_MODE ? 'All features unlocked for testing.' : 'Next renewal: Aug 24' 
                 : 'Limited access to features.'}
             </p>
           </div>
           {!isPro && (
             <button 
               onClick={onUpgrade}
               className="bg-loopd-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-loopd-primary/20"
             >
               Upgrade
             </button>
           )}
        </div>
      </div>

      {/* Referral */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-3 px-2">Referrals</h3>
         <div className="bg-gradient-to-r from-loopd-primary/10 to-orange-50 p-5 rounded-2xl border border-loopd-primary/20">
            <div className="flex items-start gap-4">
              <div className="bg-white p-2 rounded-lg text-loopd-primary shadow-sm">
                <Icons.Heart size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">Share the Loop</h4>
                <p className="text-xs text-gray-600 mt-1 mb-3">Invite friends to unlock badges and early access features.</p>
                <div className="bg-white p-2 rounded-lg border border-gray-200 flex items-center justify-between cursor-pointer active:scale-95 transition-transform">
                   <code className="text-loopd-primary font-bold text-sm">{user.referralCode}</code>
                   <Icons.More size={16} className="text-gray-400" />
                </div>
              </div>
            </div>
         </div>
      </div>

      {/* Settings List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <SettingItem icon={Icons.Clock} label="Time Zone" value="Sydney (GMT+10)" />
        <SettingItem icon={Icons.Calendar} label="Connected Calendar" value={isPro ? "Google Calendar" : "None"} isProOnly={!isPro} />
        <SettingItem icon={Icons.Shield} label="Privacy" />
        <SettingItem icon={Icons.User} label="Log Out" isDestructive />
      </div>
    </div>
  );
};

const SettingItem = ({ icon: Icon, label, value, isProOnly, isDestructive }: any) => (
  <button className="w-full flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${isDestructive ? 'bg-red-50 text-red-400' : 'bg-gray-50 text-gray-500'}`}>
        <Icon size={18} />
      </div>
      <span className={`font-medium ${isDestructive ? 'text-red-400' : 'text-gray-700'}`}>{label}</span>
      {isProOnly && (
        <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full">PRO</span>
      )}
    </div>
    <div className="flex items-center gap-2">
      {value && <span className="text-sm text-gray-400">{value}</span>}
      <Icons.ChevronRight size={16} className="text-gray-300" />
    </div>
  </button>
);
