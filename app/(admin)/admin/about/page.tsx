import { createClient } from '@/lib/supabase/server';
import AboutForm from './AboutForm';

export default async function AboutAdminPage() {
  const supabase = await createClient();
  const { data: aboutData } = await supabase
    .from('about')
    .select('*')
    .limit(1)
    .single();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">About Profile</h1>
        <p className="text-zinc-400 mt-2">Manage your personal bio, tech stack, and animated stats.</p>
      </div>

      <AboutForm initialData={aboutData} />
    </div>
  );
}
