import React from 'react';
import { Circle, User } from '../types';
import { Icons } from '../components/Icons';

interface CirclesProps {
  circles: Circle[];
  users: User[]; // Mock "all users" for context
  checkAccess: (feature: string, currentCount?: number) => boolean;
}

export const Circles: React.FC<CirclesProps> = ({ circles, users, checkAccess }) => {
  
  const handleAddCircle = () => {
    if (checkAccess('maxCircles', circles.length)) {
      alert("Create Circle Flow would open here.");
    }
  };

  return (
    <div className="p-6 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-loopd-dark">My Circles</h1>
        <button 
          onClick={handleAddCircle}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
        >
          <Icons.Plus size={18} />
        </button>
      </div>

      <div className="space-y-4">
        {circles.map(circle => (
          <div key={circle.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{circle.name}</h3>
                <p className="text-sm text-gray-500">{circle.description}</p>
              </div>
              <span className="bg-loopd-accent/30 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
                {circle.members.length} members
              </span>
            </div>
            
            {/* Avatars Preview */}
            <div className="flex items-center justify-between mt-4">
               <div className="flex -space-x-2">
                 {circle.members.slice(0,4).map((m, i) => (
                   <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500">
                     {/* In a real app, look up user avatar */}
                     {m.role === 'owner' ? '★' : ''}
                   </div>
                 ))}
                 {circle.members.length > 4 && (
                   <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-400">
                     +{circle.members.length - 4}
                   </div>
                 )}
               </div>
               <Icons.ChevronRight size={20} className="text-gray-300" />
            </div>
          </div>
        ))}
      </div>

      {/* Referral Teaser */}
      <div className="mt-8 bg-gradient-to-br from-loopd-primary to-orange-400 p-6 rounded-2xl text-white relative overflow-hidden">
        <Icons.Heart className="absolute -right-4 -bottom-4 text-white opacity-20" size={120} />
        <h3 className="font-bold text-lg mb-2 relative z-10">Expand your loop</h3>
        <p className="text-sm text-white/90 mb-4 relative z-10">
          Invite friends to earn the "Circle Maker" badge and unlock early features.
        </p>
        <button className="bg-white text-loopd-primary text-sm font-bold py-2 px-4 rounded-lg relative z-10 shadow-lg">
          Share Invite Link
        </button>
      </div>
    </div>
  );
};
