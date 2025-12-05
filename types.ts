export interface Track {
  id: string;
  name: string;
  color: string;
  audioBuffer: AudioBuffer | null;
  isMuted: boolean;
  isSolo: boolean;
  volume: number; // 0.0 to 1.0
  isRecording: boolean;
  hasRecordedData: boolean;
}

export interface Inspiration {
  genre: string;
  bpm: number;
  key: string;
  progression: string;
  description: string;
  suggestedInstruments: string[];
}

export enum AppState {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  RECORDING = 'RECORDING'
}
