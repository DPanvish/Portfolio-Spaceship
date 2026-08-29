import { create } from 'zustand';

interface SoundState {
  isMuted: boolean;
  toggleMute: () => void;
  unmute: () => void;
  playHover: () => void;
  playClick: () => void;
}

// Lazy initialization of Web Audio Context
let audioCtx: AudioContext | null = null;
let ambientNodes: { oscs: OscillatorNode[], lfo: OscillatorNode, filter: BiquadFilterNode, gain: GainNode } | null = null;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

// Cyberpunk Hover Tick (Crisp, high-tech click)
const playSynthHover = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  
  if (ctx.state === 'suspended') ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'square';
  // Very high short burst
  osc.frequency.setValueAtTime(3000, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.02);
  
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);

  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 2000;

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.025);
};

// Cyberpunk Click (Digital confirm, double beep)
const playSynthClick = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  
  // First beep
  osc.frequency.setValueAtTime(1200, ctx.currentTime);
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

  // Second higher beep immediately after
  osc.frequency.setValueAtTime(1600, ctx.currentTime + 0.06);
  gain.gain.setValueAtTime(0, ctx.currentTime + 0.06);
  gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.07);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.15);
};

// Cyberpunk Sweeping Synth Pad
const toggleSynthAmbient = (play: boolean) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (play) {
    if (ctx.state === 'suspended') ctx.resume();
    if (!ambientNodes) {
      // Create a minor 9th chord pad with sawtooths
      const frequencies = [110.00, 164.81, 196.00, 246.94]; // A2, E3, G3, B3 (Am9 feel)
      const oscs: OscillatorNode[] = [];
      const masterGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      // Lowpass filter for the sweeping effect
      filter.type = 'lowpass';
      filter.frequency.value = 400; // Start low
      filter.Q.value = 2; // Slight resonance

      // LFO to modulate filter cutoff
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.05; // Very slow sweep (20s cycle)
      
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 800; // Sweep depth (400Hz to 1200Hz)
      
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      frequencies.forEach(freq => {
        // Main osc
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = freq;
        
        // Detuned copy for thickness
        const detuneOsc = ctx.createOscillator();
        detuneOsc.type = 'sawtooth';
        detuneOsc.frequency.value = freq;
        detuneOsc.detune.value = 8; // 8 cents off
        
        // Chorus copy
        const detuneOsc2 = ctx.createOscillator();
        detuneOsc2.type = 'sawtooth';
        detuneOsc2.frequency.value = freq;
        detuneOsc2.detune.value = -8; 
        
        osc.connect(filter);
        detuneOsc.connect(filter);
        detuneOsc2.connect(filter);
        
        osc.start();
        detuneOsc.start();
        detuneOsc2.start();
        
        oscs.push(osc, detuneOsc, detuneOsc2);
      });
      
      lfo.start();

      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 3); // Slow fade in
      
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);
      
      ambientNodes = { oscs, lfo, filter, gain: masterGain };
    }
  } else {
    if (ambientNodes) {
      const { oscs, lfo, gain } = ambientNodes;
      gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 2); // Slow fade out
      setTimeout(() => {
        oscs.forEach(osc => {
          osc.stop();
          osc.disconnect();
        });
        lfo.stop();
        lfo.disconnect();
        gain.disconnect();
        ambientNodes = null;
      }, 2000);
    }
  }
};

export const useSoundStore = create<SoundState>((set, get) => ({
  isMuted: true,
  
  toggleMute: () => {
    const nextMuted = !get().isMuted;
    set({ isMuted: nextMuted });
    toggleSynthAmbient(!nextMuted);
  },

  unmute: () => {
    if (get().isMuted) {
      set({ isMuted: false });
      toggleSynthAmbient(true);
    }
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
