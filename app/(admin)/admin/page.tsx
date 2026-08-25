import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export default async function AdminPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    if (user) await supabase.auth.signOut()
    redirect('/admin/login')
  }

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            Admin Terminal
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-zinc-500">{user.email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-md hover:bg-zinc-800 transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4">
            <h2 className="text-lg font-semibold text-zinc-100">Projects Database</h2>
            <p className="text-sm text-zinc-500">
              Data synchronized via Supabase. Edit in the Supabase Dashboard.
            </p>
          </div>
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4">
            <h2 className="text-lg font-semibold text-zinc-100">Experience Timeline</h2>
            <p className="text-sm text-zinc-500">
              Data synchronized via Supabase. Edit in the Supabase Dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
