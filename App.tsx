import React, { useEffect, useState } from 'react';
import { useAudioEngine } from './hooks/useAudioEngine';
import { TrackControl } from './components/TrackControl';
import { CreativeAssistant } from './components/CreativeAssistant';
import { Play, Square, Settings2, Activity, Disc, Zap } from 'lucide-react';

const App: React.FC = () => {
  const {
    tracks,
    isPlaying,
    currentTime,
    loopDuration,
    updateTrackVolume,
    toggleMute,
    toggleSolo,
    play,
    stop,
    startRecording,
    stopRecording,
    clearTrack,
    startAudioContext
  } = useAudioEngine();

  const [hasInteracted, setHasInteracted] = useState(false);

  // Initial interaction handler to unlock AudioContext
  const handleInitialInteraction = () => {
    if (!hasInteracted) {
        startAudioContext();
        setHasInteracted(true);
    }
  };

  // Progress bar calculation
  const progressPercent = loopDuration > 0 ? (currentTime / loopDuration) * 100 : 0;

  return (
    <div 
        className="min-h-screen bg-slate-900 text-slate-200 p-4 md:p-8"
        onClick={handleInitialInteraction}
    >
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-4">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-900/20">
                    <Disc size={32} className={`text-white ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-slate-900 p-1">
                        <Zap size={16} className="text-yellow-400" fill="currentColor" />
                    </div>
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white">Loopd</h1>
                    <p className="text-slate-500 font-medium">Production Station v1.0</p>
                </div>
            </div>
            
            {/* Master Controls */}
            <div className="flex items-center gap-4 rounded-2xl bg-slate-800 p-2 shadow-xl shadow-black/20">
                <div className="flex flex-col items-center px-4 border-r border-slate-700">
                    <span className="text-xs font-bold text-slate-500 uppercase">Master</span>
                    <span className="text-indigo-400 font-mono text-sm">{loopDuration > 0 ? loopDuration.toFixed(1) + 's' : '--'}</span>
                </div>
                
                <button 
                    onClick={(e) => { e.stopPropagation(); isPlaying ? stop() : play(); }}
                    className={`flex h-14 w-14 items-center justify-center rounded-xl transition-all ${isPlaying ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-900/20'}`}
                >
                    {isPlaying ? <Square size={24} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                </button>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Tracks */}
            <div className="lg:col-span-2 space-y-6">
                
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                        <Settings2 size={20} className="text-slate-400" />
                        Tracks
                    </h2>
                    {/* Visualizer Bar */}
                    <div className="h-2 w-32 md:w-64 bg-slate-800 rounded-full overflow-hidden relative">
                         {isPlaying && (
                             <div 
                                className="absolute top-0 bottom-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-75 ease-linear"
                                style={{ left: `${progressPercent}%`, width: '4px', boxShadow: '0 0 10px white' }}
                             ></div>
                         )}
                    </div>
                </div>

                <div className="space-y-4">
                    {tracks.map(track => (
                        <TrackControl
                            key={track.id}
                            track={track}
                            onVolumeChange={updateTrackVolume}
                            onMuteToggle={toggleMute}
                            onSoloToggle={toggleSolo}
                            onRecordStart={startRecording}
                            onRecordStop={stopRecording}
                            onClear={clearTrack}
                        />
                    ))}
                </div>

                {tracks.every(t => !t.hasRecordedData) && (
                    <div className="rounded-xl border border-dashed border-slate-700 bg-slate-800/30 p-8 text-center">
                        <Activity className="mx-auto mb-3 text-slate-600" size={32} />
                        <h3 className="text-lg font-medium text-slate-400">No loops recorded</h3>
                        <p className="text-slate-500 text-sm">Hit the mic button on a track to start layering your sound.</p>
                    </div>
                )}
            </div>

            {/* Right Column: AI & Info */}
            <div className="space-y-6">
                <CreativeAssistant />
                
                <div className="rounded-2xl bg-slate-800 p-6 shadow-sm">
                    <h3 className="font-bold text-slate-300 mb-4">Quick Tips</h3>
                    <ul className="space-y-3 text-sm text-slate-400">
                        <li className="flex items-start gap-2">
                            <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                            Use headphones for best recording quality to avoid feedback.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                            The first track you record sets the loop length for the session.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                            Use the AI Assistant if you need a chord progression or genre idea.
                        </li>
                    </ul>
                </div>

                {!hasInteracted && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
                        <div className="max-w-md rounded-2xl bg-slate-900 p-8 text-center shadow-2xl border border-slate-800">
                            <h2 className="mb-2 text-2xl font-bold text-white">Welcome to Loopd</h2>
                            <p className="mb-6 text-slate-400">Click anywhere to enable the audio engine and start creating.</p>
                            <button 
                                onClick={handleInitialInteraction}
                                className="w-full rounded-xl bg-indigo-600 py-3 font-bold text-white transition-all hover:bg-indigo-500 hover:scale-105 active:scale-95 animate-pulse"
                            >
                                Start Creating
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;
