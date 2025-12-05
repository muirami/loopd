import { useState, useEffect, useRef } from 'react';
import { Track } from '../types';

export const useAudioEngine = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  // Ref to track audio context for cleanup without dependency cycles
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const [tracks, setTracks] = useState<Track[]>([
    { id: '1', name: 'Drums', color: 'bg-rose-500', audioBuffer: null, isMuted: false, isSolo: false, volume: 0.8, isRecording: false, hasRecordedData: false },
    { id: '2', name: 'Bass', color: 'bg-violet-500', audioBuffer: null, isMuted: false, isSolo: false, volume: 0.8, isRecording: false, hasRecordedData: false },
    { id: '3', name: 'Keys', color: 'bg-amber-500', audioBuffer: null, isMuted: false, isSolo: false, volume: 0.8, isRecording: false, hasRecordedData: false },
    { id: '4', name: 'Vocals', color: 'bg-emerald-500', audioBuffer: null, isMuted: false, isSolo: false, volume: 0.8, isRecording: false, hasRecordedData: false },
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [loopDuration, setLoopDuration] = useState(0); 

  // Refs for audio scheduling
  const nextStartTimeRef = useRef<number>(0);
  const sourceNodesRef = useRef<Map<string, AudioBufferSourceNode>>(new Map());
  const gainNodesRef = useRef<Map<string, GainNode>>(new Map());
  const masterGainRef = useRef<GainNode | null>(null);
  const requestAnimFrameRef = useRef<number | null>(null);
  
  // Recording Refs
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const activeRecordingTrackIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      // Use ref to access current context in cleanup
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      if (requestAnimFrameRef.current) {
        cancelAnimationFrame(requestAnimFrameRef.current);
      }
    };
  }, []);

  const startAudioContext = async () => {
    // Cross-browser AudioContext support
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      console.error("AudioContext not supported in this browser");
      return null;
    }

    if (!audioContextRef.current) {
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx; // Sync ref
      
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      
      const master = ctx.createGain();
      master.connect(ctx.destination);
      masterGainRef.current = master;
      
      setAudioContext(ctx); // Sync state
      return ctx;
    } else if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
      return audioContextRef.current;
    }
    return audioContextRef.current;
  };

  const updateTrackVolume = (id: string, val: number) => {
    setTracks(prev => prev.map(t => t.id === id ? { ...t, volume: val } : t));
    const gainNode = gainNodesRef.current.get(id);
    if (gainNode) {
      gainNode.gain.setValueAtTime(val, audioContextRef.current?.currentTime || 0);
    }
  };

  const toggleMute = (id: string) => {
    setTracks(prev => {
      const newTracks = prev.map(t => t.id === id ? { ...t, isMuted: !t.isMuted } : t);
      updateGainNodes(newTracks);
      return newTracks;
    });
  };

  const toggleSolo = (id: string) => {
    setTracks(prev => {
      const willSolo = !prev.find(t => t.id === id)?.isSolo;
      const newTracks = prev.map(t => {
         if (t.id === id) return { ...t, isSolo: willSolo };
         if (willSolo) return { ...t, isSolo: false }; 
         return t;
      });
      updateGainNodes(newTracks);
      return newTracks;
    });
  };
  
  const updateGainNodes = (currentTracks: Track[]) => {
    const isAnySolo = currentTracks.some(t => t.isSolo);
    currentTracks.forEach(track => {
      const gainNode = gainNodesRef.current.get(track.id);
      if (gainNode) {
        let targetGain = track.volume;
        if (track.isMuted) targetGain = 0;
        if (isAnySolo && !track.isSolo) targetGain = 0;
        
        // Smooth transition to prevent clicks
        const ctx = audioContextRef.current;
        if (ctx) {
             gainNode.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.05);
        }
      }
    });
  };

  const play = async () => {
    const ctx = await startAudioContext();
    if (!ctx) return;

    if (isPlaying) {
      stop();
      return;
    }

    // Determine loop length
    let duration = loopDuration;
    if (duration === 0) {
       const recordedTracks = tracks.filter(t => t.audioBuffer);
       if (recordedTracks.length > 0) {
         duration = Math.max(...recordedTracks.map(t => t.audioBuffer!.duration));
         setLoopDuration(duration);
       } else {
         duration = 2.0; // Default dummy loop
       }
    }

    const now = ctx.currentTime;
    nextStartTimeRef.current = now + 0.1; 
    
    scheduleLoop(nextStartTimeRef.current, duration);
    setIsPlaying(true);
    
    const tick = () => {
      if (!ctx) return;
      const elapsed = duration > 0 ? (ctx.currentTime - nextStartTimeRef.current) % duration : 0;
      setCurrentTime(elapsed >= 0 ? elapsed : 0);
      
      if (ctx.state === 'running') {
        requestAnimFrameRef.current = requestAnimationFrame(tick);
      }
    };
    tick();
  };

  const scheduleLoop = (startTime: number, duration: number) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;
    
    tracks.forEach(track => {
      if (track.audioBuffer) {
        const source = ctx.createBufferSource();
        source.buffer = track.audioBuffer;
        source.loop = true; 
        
        const gain = ctx.createGain();
        gain.gain.value = track.isMuted ? 0 : track.volume;
        const isAnySolo = tracks.some(t => t.isSolo);
        if (isAnySolo && !track.isSolo) gain.gain.value = 0;

        source.connect(gain);
        gain.connect(masterGainRef.current!);
        
        source.start(startTime);
        
        sourceNodesRef.current.set(track.id, source);
        gainNodesRef.current.set(track.id, gain);
      }
    });
  };

  const stop = () => {
    sourceNodesRef.current.forEach(node => {
      try { node.stop(); } catch(e) {}
    });
    sourceNodesRef.current.clear();
    gainNodesRef.current.clear();
    if (requestAnimFrameRef.current) cancelAnimationFrame(requestAnimFrameRef.current);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const startRecording = async (trackId: string) => {
    const ctx = await startAudioContext();
    if (!ctx) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4'; 
      }
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      activeRecordingTrackIdRef.current = trackId;

      setTracks(prev => prev.map(t => t.id === trackId ? { ...t, isRecording: true } : t));

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const arrayBuffer = await blob.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        
        // Critical: Update loop duration if it's the first track
        if (loopDuration === 0) {
            setLoopDuration(audioBuffer.duration);
        }

        setTracks(prev => prev.map(t => {
          if (t.id === trackId) {
            return {
              ...t,
              isRecording: false,
              hasRecordedData: true,
              audioBuffer: audioBuffer
            };
          }
          return t;
        }));
        
        activeRecordingTrackIdRef.current = null;
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      
      if (!isPlaying && loopDuration > 0) {
          play(); 
      }

    } catch (err) {
      console.error("Error accessing microphone:", err);
      setTracks(prev => prev.map(t => t.id === trackId ? { ...t, isRecording: false } : t));
    }
  };

  const stopRecording = (trackId: string) => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };
  
  const clearTrack = (trackId: string) => {
      setTracks(prev => {
          const nextTracks = prev.map(t => t.id === trackId ? { ...t, audioBuffer: null, hasRecordedData: false } : t);
          
          // Check if any tracks remain with data
          const hasData = nextTracks.some(t => t.hasRecordedData);
          if (!hasData) {
              setLoopDuration(0);
              // We must stop playback if no tracks remain to prevent ghost loops
              stop(); 
          }
          return nextTracks;
      });

      const node = sourceNodesRef.current.get(trackId);
      if (node) {
          try { node.stop(); } catch(e){}
          sourceNodesRef.current.delete(trackId);
      }
  };

  return {
    audioContext,
    startAudioContext,
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
    clearTrack
  };
};
