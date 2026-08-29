'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveSettings(formData: FormData) {
  const supabase = await createClient()

  const data = {
    contact_email: formData.get('contact_email') as string,
    twitter_url: formData.get('twitter_url') as string,
    github_url: formData.get('github_url') as string,
    linkedin_url: formData.get('linkedin_url') as string,
  }

  // Check if a row exists
  const { data: existing } = await supabase.from('settings').select('id').limit(1).single()

  if (existing) {
    const { error } = await supabase.from('settings').update(data).eq('id', existing.id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase.from('settings').insert([data])
    if (error) throw new Error(error.message)
  }

  revalidatePath('/admin/settings')
  revalidatePath('/', 'layout')
}
