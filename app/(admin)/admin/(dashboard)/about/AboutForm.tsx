'use client'

import { useTransition } from 'react'
import { saveAbout } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function AboutForm({ initialData }: { initialData: any }) {
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await saveAbout(formData)
        toast.success('About section updated successfully')
      } catch (e: any) {
        toast.error(e.message)
      }
    })
  }

  // Fallback data if none exists
  const data = initialData || {
    title_primary: 'Frontend',
    title_secondary: 'Architect',
    paragraph_1: 'I build interfaces where every detail compounds into something that feels right. Performance-first, animation-aware, and obsessively crafted.',
    paragraph_2: 'Bridging the gap between design engineering and technical architecture — making software that people love without knowing why.',
    skills: ['React', 'Three.js', 'Next.js', 'TypeScript', 'Framer Motion', 'WebGL', 'GSAP', 'Node.js'],
    years_exp: 5,
    projects_count: 30,
    lines_code: 15
  }

  const skillsString = Array.isArray(data.skills) ? data.skills.join(', ') : ''

  return (
    <form action={handleSubmit} className="space-y-8 bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl max-w-3xl">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-white">Hero Titles</h3>
          <p className="text-sm text-zinc-400">The massive text displayed at the top of the about section.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title_primary" className="text-zinc-400">Primary Title</Label>
            <Input id="title_primary" name="title_primary" defaultValue={data.title_primary} required className="bg-zinc-900 border-zinc-800" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title_secondary" className="text-zinc-400">Secondary Title (Dimmed)</Label>
            <Input id="title_secondary" name="title_secondary" defaultValue={data.title_secondary} required className="bg-zinc-900 border-zinc-800" />
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-zinc-800">
        <div>
          <h3 className="text-lg font-medium text-white">Content Paragraphs</h3>
          <p className="text-sm text-zinc-400">Your bio text split into two neat paragraphs.</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paragraph_1" className="text-zinc-400">Paragraph 1</Label>
            <Textarea id="paragraph_1" name="paragraph_1" defaultValue={data.paragraph_1} required className="bg-zinc-900 border-zinc-800 resize-none h-20" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paragraph_2" className="text-zinc-400">Paragraph 2</Label>
            <Textarea id="paragraph_2" name="paragraph_2" defaultValue={data.paragraph_2} required className="bg-zinc-900 border-zinc-800 resize-none h-20" />
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-zinc-800">
        <div>
          <h3 className="text-lg font-medium text-white">Skills & Tech Stack</h3>
          <p className="text-sm text-zinc-400">Comma-separated list of technologies.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="skills" className="text-zinc-400">Skills</Label>
          <Input id="skills" name="skills" defaultValue={skillsString} required className="bg-zinc-900 border-zinc-800" placeholder="React, Next.js, GSAP..." />
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-zinc-800">
        <div>
          <h3 className="text-lg font-medium text-white">Animated Statistics</h3>
          <p className="text-sm text-zinc-400">The counter numbers that count up on scroll.</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="years_exp" className="text-zinc-400">Years Exp</Label>
            <Input id="years_exp" name="years_exp" type="number" defaultValue={data.years_exp} required className="bg-zinc-900 border-zinc-800" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="projects_count" className="text-zinc-400">Projects</Label>
            <Input id="projects_count" name="projects_count" type="number" defaultValue={data.projects_count} required className="bg-zinc-900 border-zinc-800" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lines_code" className="text-zinc-400">Lines/Day</Label>
            <Input id="lines_code" name="lines_code" type="number" defaultValue={data.lines_code} required className="bg-zinc-900 border-zinc-800" />
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={isPending} className="bg-cyan-500 text-zinc-950 hover:bg-cyan-400 font-semibold px-8">
          {isPending ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </form>
  )
}
