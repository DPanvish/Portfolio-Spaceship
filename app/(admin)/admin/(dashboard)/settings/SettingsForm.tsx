'use client'

import { useTransition } from 'react'
import { saveSettings } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function SettingsForm({ initialData }: { initialData: any }) {
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await saveSettings(formData)
        toast.success('Settings updated successfully')
      } catch (e: any) {
        toast.error(e.message)
      }
    })
  }

  // Fallback data if none exists
  const data = initialData || {
    contact_email: 'hello@spaceship.com',
    twitter_url: '',
    github_url: '',
    linkedin_url: '',
  }

  return (
    <form action={handleSubmit} className="space-y-8 bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl max-w-3xl">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-white">Contact & Transmissions</h3>
          <p className="text-sm text-zinc-400">Where should transmissions from the Contact section be routed?</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact_email" className="text-zinc-400">Receiving Email Address</Label>
          <Input id="contact_email" name="contact_email" type="email" defaultValue={data.contact_email} required className="bg-zinc-900 border-zinc-800" />
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-zinc-800">
        <div>
          <h3 className="text-lg font-medium text-white">Social Frequencies</h3>
          <p className="text-sm text-zinc-400">Links to your social media profiles.</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="twitter_url" className="text-zinc-400">Twitter / X URL</Label>
            <Input id="twitter_url" name="twitter_url" type="url" defaultValue={data.twitter_url} className="bg-zinc-900 border-zinc-800" placeholder="https://x.com/yourhandle" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github_url" className="text-zinc-400">GitHub URL</Label>
            <Input id="github_url" name="github_url" type="url" defaultValue={data.github_url} className="bg-zinc-900 border-zinc-800" placeholder="https://github.com/yourhandle" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin_url" className="text-zinc-400">LinkedIn URL</Label>
            <Input id="linkedin_url" name="linkedin_url" type="url" defaultValue={data.linkedin_url} className="bg-zinc-900 border-zinc-800" placeholder="https://linkedin.com/in/yourhandle" />
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={isPending} className="bg-cyan-500 text-zinc-950 hover:bg-cyan-400 font-semibold px-8">
          {isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </form>
  )
}
