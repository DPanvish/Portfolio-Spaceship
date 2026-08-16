import { create } from 'zustand';

interface AppState {
  // Scroll progress from 0 (top) to 1 (bottom)
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
  
  // The index of the waypoint we are currently closest to
  activeWaypoint: number;
  setActiveWaypoint: (index: number) => void;
  
  // Audio state
  isMuted: boolean;
  toggleMute: () => void;
}

export const useStore = create<AppState>((set) => ({
  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  
  activeWaypoint: 0,
  setActiveWaypoint: (index) => set({ activeWaypoint: index }),
  
  isMuted: true, // Muted by default per plan rules
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
}));
