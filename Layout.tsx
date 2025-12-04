import React from 'react';
import { Icons } from './Icons';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  const isTabVisible = currentView !== ViewState.ONBOARDING;

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState; icon: any; label: string }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => setView(view)}
        className={`flex flex-col items-center justify-center w-full py-2 transition-colors duration-200 ${
          isActive ? 'text-loopd-primary' : 'text-gray-400 hover:text-gray-500'
        }`}
      >
        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
        <span className="text-[10px] font-medium mt-1">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full w-full bg-loopd-base max-w-md mx-auto shadow-2xl overflow-hidden relative pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Header */}
      {isTabVisible && (
        <header className="flex-none h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 z-10 sticky top-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-loopd-primary flex items-center justify-center text-white font-bold text-lg">
              L
            </div>
            <span className="text-xl font-bold text-loopd-dark tracking-tight">Loopd</span>
          </div>
          <button className="text-gray-400">
            <Icons.Menu size={24} />
          </button>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      {isTabVisible && (
        <nav className="flex-none h-20 bg-white border-t border-gray-100 flex items-center justify-around px-2 pb-6 z-20 absolute bottom-0 w-full rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <NavItem view={ViewState.HOME} icon={Icons.Home} label="Home" />
          <NavItem view={ViewState.CIRCLES} icon={Icons.Users} label="Circles" />
          <div className="relative -top-5">
            <button 
              onClick={() => setView(ViewState.PLAN_HANG)}
              className="w-14 h-14 bg-loopd-primary rounded-full flex items-center justify-center text-white shadow-lg hover:bg-opacity-90 transition-transform active:scale-95 border-4 border-white"
            >
              <Icons.Plus size={32} />
            </button>
          </div>
          <NavItem view={ViewState.SCHEDULE} icon={Icons.Calendar} label="Schedule" />
          <NavItem view={ViewState.PROFILE} icon={Icons.User} label="Profile" />
        </nav>
      )}
    </div>
  );
};