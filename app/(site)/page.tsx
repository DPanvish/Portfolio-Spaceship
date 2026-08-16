import SceneCanvas from '@/components/scene/SceneCanvas';

// This is a Server Component — only SceneCanvas (Client) renders the 3D world.
// The outer div is the full-screen container; the Canvas mounts inside it.

export default function SitePage() {
  return (
    // This div fills the fixed inset-0 viewport provided by ScrollProvider
    <div className="w-full h-full bg-black">
      <SceneCanvas />

      {/* HUD overlays are layered above the canvas via absolute positioning */}
      {/* Content overlays added in Phase 4 */}
    </div>
  );
}
