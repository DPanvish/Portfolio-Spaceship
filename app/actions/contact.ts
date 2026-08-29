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
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 40px 0; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
            .header { background-color: #09090b; padding: 32px 40px; text-align: center; }
            .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; letter-spacing: -0.5px; }
            .content { padding: 40px; }
            .section { margin-bottom: 24px; }
            .label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #71717a; margin-bottom: 8px; font-weight: 600; }
            .value { font-size: 16px; color: #18181b; line-height: 1.5; margin: 0; }
            .message-box { background-color: #f4f4f5; padding: 20px; border-radius: 8px; margin-top: 8px; white-space: pre-wrap; font-size: 15px; color: #27272a; line-height: 1.6; border: 1px solid #e4e4e7; }
            .footer { padding: 24px 40px; background-color: #fafafa; border-top: 1px solid #e4e4e7; text-align: center; }
            .footer p { margin: 0; font-size: 13px; color: #a1a1aa; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Transmission Received</h1>
            </div>
            <div class="content">
              <div class="section">
                <div class="label">Sender Identity</div>
                <p class="value"><strong>${name}</strong></p>
              </div>
              <div class="section">
                <div class="label">Reply-To Address</div>
                <p class="value"><a href="mailto:${email}" style="color: #06b6d4; text-decoration: none;">${email}</a></p>
              </div>
              <div class="section">
                <div class="label">Payload / Message</div>
                <div class="message-box">${message}</div>
              </div>
            </div>
            <div class="footer">
              <p>This message was securely transmitted via your Spaceship Portfolio.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', // Default resend testing domain
      to: [recipientEmail],
      replyTo: email,
      subject: `New Transmission from ${name}`,
      html: htmlTemplate,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`, // Fallback text version
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}
