import { create } from 'zustand';
import { Howl, Howler } from 'howler';

interface SoundState {
  isMuted: boolean;
  toggleMute: () => void;
  playHover: () => void;
  playClick: () => void;
}

// We will use placeholders for the audio files.
// The user should place these files in the /public/sounds directory.
const hoverSound = typeof window !== 'undefined' ? new Howl({
  src: ['/sounds/hover.mp3'],
  volume: 0.1,
  onloaderror: () => console.warn('Missing /sounds/hover.mp3 - drop file in public folder to enable.'),
}) : null;

const clickSound = typeof window !== 'undefined' ? new Howl({
  src: ['/sounds/click.mp3'],
  volume: 0.2,
  onloaderror: () => console.warn('Missing /sounds/click.mp3 - drop file in public folder to enable.'),
}) : null;

export const ambientSound = typeof window !== 'undefined' ? new Howl({
  src: ['/sounds/ambient.mp3'],
  volume: 0.3,
  loop: true,
  onloaderror: () => console.warn('Missing /sounds/ambient.mp3 - drop file in public folder to enable.'),
}) : null;

export const useSoundStore = create<SoundState>((set, get) => ({
  isMuted: true, // Start muted to comply with browser autoplay policies
  
  toggleMute: () => {
    const nextMuted = !get().isMuted;
    Howler.mute(nextMuted);
    set({ isMuted: nextMuted });
    
    // Start ambient if unmuted for the first time
    if (!nextMuted && ambientSound && !ambientSound.playing()) {
      ambientSound.play();
      // Fade in smoothly
      ambientSound.fade(0, 0.3, 2000);
    }
  },

  playHover: () => {
    if (!get().isMuted && hoverSound) {
      hoverSound.play();
    }
  },

  playClick: () => {
    if (!get().isMuted && clickSound) {
      clickSound.play();
    }
  },
}));
