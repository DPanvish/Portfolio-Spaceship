import ScrollProvider from '@/components/providers/ScrollProvider';

// Site layout — wraps the public spaceship journey.
// No <html>/<body> here — those live in the root app/layout.tsx.
// This layout is for site-specific wrappers (e.g. audio provider, scroll provider).

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ScrollProvider>
      {children}
    </ScrollProvider>
  );
}
