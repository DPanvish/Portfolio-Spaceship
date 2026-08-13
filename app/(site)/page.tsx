import SceneCanvas from '@/components/scene/SceneCanvas';

// This is a Server Component — only SceneCanvas (Client) renders the 3D world.
// The outer div is the full-screen container; the Canvas mounts inside it.

export default function SitePage() {
  return (
    // Scroll container — height drives the camera journey (Phase 3).
    // For now, h-screen so we can verify the canvas renders.
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <SceneCanvas />

      {/* HUD overlays are layered above the canvas via absolute positioning */}
      {/* Content overlays added in Phase 4 */}
    </div>
  );
}
