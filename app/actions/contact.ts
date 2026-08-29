'use server'

import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

// We init resend only when the action runs so the build doesn't fail if the env var is missing
export async function sendContactMessage(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const message = formData.get('message') as string

  if (!name || !email || !message) {
    return { error: 'Please fill in all fields' }
  }

  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey) {
    return { error: 'Email service is not configured (missing API key)' }
  }

  const resend = new Resend(resendApiKey)
  
  // Fetch the recipient email from the settings table
  const supabase = await createClient()
  const { data: settings } = await supabase.from('settings').select('contact_email').limit(1).single()
  
  const recipientEmail = settings?.contact_email || 'panvishd@gmail.com'

  try {
    const { error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', // Default resend testing domain
      to: [recipientEmail],
      replyTo: email,
      subject: `New Transmission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}
