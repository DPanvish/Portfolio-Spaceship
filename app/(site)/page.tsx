import SceneCanvas from '@/components/scene/SceneCanvas';
import AboutOverlay from '@/components/overlays/AboutOverlay';
import ExperienceOverlay from '@/components/overlays/ExperienceOverlay';
import ScrollHint from '@/components/overlays/ScrollHint';

// This is a Server Component — only SceneCanvas (Client) renders the 3D world.
// The outer div is the full-screen container; the Canvas mounts inside it.

export default function SitePage() {
  return (
    // This div fills the fixed inset-0 viewport provided by ScrollProvider
    <div className="w-full h-full bg-black">
      <SceneCanvas />

      {/* HUD overlays are layered above the canvas via absolute positioning */}
      <AboutOverlay />
      <ExperienceOverlay />
      <ScrollHint />
    </div>
  );
}
