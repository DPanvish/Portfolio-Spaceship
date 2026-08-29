import { createClient } from '@/lib/supabase/server';
import SettingsForm from './SettingsForm';

export default async function SettingsAdminPage() {
  const supabase = await createClient();
  const { data: settingsData } = await supabase
    .from('settings')
    .select('*')
    .limit(1)
    .single();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">System Settings</h1>
        <p className="text-zinc-400 mt-2">Manage your contact email and social media links.</p>
      </div>

      <SettingsForm initialData={settingsData} />
    </div>
  );
}
