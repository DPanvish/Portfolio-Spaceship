'use client'

import { useState, useTransition } from 'react'
import { saveExperience, deleteExperience } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export function ExperienceDialog({ exp }: { exp?: any }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  
  const isEditing = !!exp

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await saveExperience(formData, exp?.id)
        toast.success(isEditing ? 'Experience updated' : 'Experience created')
        setOpen(false)
      } catch (e: any) {
        toast.error(e.message)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="bg-cyan-500 text-zinc-950 hover:bg-cyan-400 font-semibold">
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sort_order" className="text-zinc-400">Order</Label>
              <Input id="sort_order" name="sort_order" type="number" defaultValue={exp?.sort_order ?? 0} required className="bg-zinc-900 border-zinc-800" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="period" className="text-zinc-400">Period</Label>
              <Input id="period" name="period" defaultValue={exp?.period ?? ''} placeholder="e.g. 2021 — 2023" required className="bg-zinc-900 border-zinc-800" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role" className="text-zinc-400">Role</Label>
            <Input id="role" name="role" defaultValue={exp?.role ?? ''} required className="bg-zinc-900 border-zinc-800" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-zinc-400">Company</Label>
            <Input id="company" name="company" defaultValue={exp?.company ?? ''} required className="bg-zinc-900 border-zinc-800" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-zinc-400">Description</Label>
            <Textarea id="description" name="description" defaultValue={exp?.description ?? ''} required className="bg-zinc-900 border-zinc-800 resize-none h-24" />
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit" disabled={isPending} className="bg-cyan-500 text-zinc-950 hover:bg-cyan-400 font-semibold w-full">
              {isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function DeleteExperienceButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (confirm('Are you sure you want to delete this experience record?')) {
      startTransition(async () => {
        try {
          await deleteExperience(id)
          toast.success('Experience deleted')
        } catch (e: any) {
          toast.error(e.message)
        }
      })
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleDelete}
      disabled={isPending}
      className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
