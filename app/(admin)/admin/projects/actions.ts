'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteProject(id: string) {
  const supabase = await createClient()
  
  // RLS ensures only authenticated admins can delete
  const { error } = await supabase.from('projects').delete().eq('id', id)
  
  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/projects')
  revalidatePath('/', 'layout')
}

export async function saveProject(formData: FormData, id?: string) {
  const supabase = await createClient()

  const data = {
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
    title: formData.get('title') as string,
    category: formData.get('category') as string,
    description: formData.get('description') as string,
    bg_color: formData.get('bg_color') as string || '#0a0a14',
    accent_color: formData.get('accent_color') as string || '#00f0ff',
    link_url: formData.get('link_url') as string || null,
  }

  if (id) {
    const { error } = await supabase.from('projects').update(data).eq('id', id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase.from('projects').insert([data])
    if (error) throw new Error(error.message)
  }

  revalidatePath('/admin/projects')
  revalidatePath('/', 'layout')
}
