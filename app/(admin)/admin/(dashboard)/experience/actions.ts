'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteExperience(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.from('experience').delete().eq('id', id)
  
  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/experience')
  revalidatePath('/', 'layout')
}

export async function saveExperience(formData: FormData, id?: string) {
  const supabase = await createClient()

  const data = {
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
    role: formData.get('role') as string,
    company: formData.get('company') as string,
    period: formData.get('period') as string,
    description: formData.get('description') as string,
  }

  if (id) {
    const { error } = await supabase.from('experience').update(data).eq('id', id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase.from('experience').insert([data])
    if (error) throw new Error(error.message)
  }

  revalidatePath('/admin/experience')
  revalidatePath('/', 'layout')
}
