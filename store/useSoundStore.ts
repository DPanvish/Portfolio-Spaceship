import { create } from 'zustand';

interface SoundState {
  isMuted: boolean;
  toggleMute: () => void;
  playHover: () => void;
  playClick: () => void;
}

// Lazy initialization of Web Audio Context
let audioCtx: AudioContext | null = null;
let ambientOscillator: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

// Synthetic Hover Tick
const playSynthHover = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  
  if (ctx.state === 'suspended') ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  // A quick, high-pitched "blip"
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.03);
  
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.05);
};

// Synthetic Click Bloop
const playSynthClick = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.1);
};

// Synthetic Ambient Rumble
const toggleSynthAmbient = (play: boolean) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (play) {
    if (ctx.state === 'suspended') ctx.resume();
    if (!ambientOscillator) {
      ambientOscillator = ctx.createOscillator();
      ambientGain = ctx.createGain();
      
      // Low rumble using a triangle wave
      ambientOscillator.type = 'triangle';
      ambientOscillator.frequency.value = 55; // Low A
      
      ambientGain.gain.setValueAtTime(0, ctx.currentTime);
      ambientGain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 2); // Fade in over 2s
      
      ambientOscillator.connect(ambientGain);
      ambientGain.connect(ctx.destination);
      
      ambientOscillator.start();
    }
  } else {
    if (ambientGain) {
      ambientGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 1);
      setTimeout(() => {
        if (ambientOscillator) {
          ambientOscillator.stop();
          ambientOscillator.disconnect();
          ambientOscillator = null;
        }
        if (ambientGain) {
          ambientGain.disconnect();
          ambientGain = null;
        }
      }, 1000);
    }
  }
};

export const useSoundStore = create<SoundState>((set, get) => ({
  isMuted: true, // Start muted to comply with browser autoplay policies
  
  toggleMute: () => {
    const nextMuted = !get().isMuted;
    set({ isMuted: nextMuted });
    toggleSynthAmbient(!nextMuted);
  },

  playHover: () => {
    if (!get().isMuted) {
      playSynthHover();
    }
  },

  playClick: () => {
    if (!get().isMuted) {
      playSynthClick();
    }
  },
}));
