// Admin layout — wraps all auth-gated admin panel routes.
// No <html>/<body> here — those live in the root app/layout.tsx.
// shadcn/ui sidebar and admin chrome will be added in Phase 8.

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {children}
    </div>
  );
}
