'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveAbout(formData: FormData) {
  const supabase = await createClient()

  // Convert comma separated skills into an array
  const skillsString = formData.get('skills') as string
  const skills = skillsString.split(',').map(s => s.trim()).filter(Boolean)

  const data = {
    title_primary: formData.get('title_primary') as string,
    title_secondary: formData.get('title_secondary') as string,
    paragraph_1: formData.get('paragraph_1') as string,
    paragraph_2: formData.get('paragraph_2') as string,
    skills,
    years_exp: parseInt(formData.get('years_exp') as string) || 0,
    projects_count: parseInt(formData.get('projects_count') as string) || 0,
    lines_code: parseInt(formData.get('lines_code') as string) || 0,
  }

  // Check if a row exists
  const { data: existing } = await supabase.from('about').select('id').limit(1).single()

  if (existing) {
    const { error } = await supabase.from('about').update(data).eq('id', existing.id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase.from('about').insert([data])
    if (error) throw new Error(error.message)
  }

  revalidatePath('/admin/about')
  revalidatePath('/', 'layout')
}
