'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (email !== process.env.ADMIN_EMAIL) {
    redirect('/admin/login?error=Unauthorized email address')
  }

  const supabase = await createClient()
  const data = { email, password }
  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/admin')
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (email !== process.env.ADMIN_EMAIL) {
    redirect('/admin/login?error=Unauthorized to create admin accounts')
  }

  const supabase = await createClient()
  const data = { email, password }
  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/admin')
}
