'use client'

import { useState, useTransition } from 'react'
import { saveProject, deleteProject } from './actions'
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
import { Plus, Pencil, Trash2, ImagePlus } from 'lucide-react'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'

export function ProjectDialog({ project }: { project?: any }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [imageUrl, setImageUrl] = useState<string>(project?.image_url || '')
  
  const isEditing = !!project

  async function handleSubmit(formData: FormData) {
    // Append the image_url to the formData before saving
    formData.append('image_url', imageUrl)

    startTransition(async () => {
      try {
        await saveProject(formData, project?.id)
        toast.success(isEditing ? 'Project updated' : 'Project created')
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
            Add Project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-zinc-100 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Project' : 'Add Project'}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label className="text-zinc-400">Project Image</Label>
            <div className="mt-2">
              <CldUploadWidget 
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={(result: any) => {
                  setImageUrl(result.info.secure_url);
                }}
              >
                {({ open }) => {
                  return (
                    <div 
                      onClick={() => open()}
                      className="border-2 border-dashed border-zinc-700 hover:border-zinc-500 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-zinc-900/50"
                    >
                      {imageUrl ? (
                        <div className="relative w-full aspect-[16/9] rounded-md overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={imageUrl} alt="Project" className="object-cover w-full h-full" />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-sm font-medium">Change Image</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-6">
                          <ImagePlus className="w-8 h-8 text-zinc-500 mb-2" />
                          <span className="text-sm text-zinc-400">Click to upload image via Cloudinary</span>
                        </div>
                      )}
                    </div>
                  );
                }}
              </CldUploadWidget>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sort_order" className="text-zinc-400">Order</Label>
              <Input id="sort_order" name="sort_order" type="number" defaultValue={project?.sort_order ?? 0} required className="bg-zinc-900 border-zinc-800" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-zinc-400">Category</Label>
              <Input id="category" name="category" defaultValue={project?.category ?? ''} required className="bg-zinc-900 border-zinc-800" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title" className="text-zinc-400">Title</Label>
            <Input id="title" name="title" defaultValue={project?.title ?? ''} required className="bg-zinc-900 border-zinc-800" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-zinc-400">Description</Label>
            <Textarea id="description" name="description" defaultValue={project?.description ?? ''} required className="bg-zinc-900 border-zinc-800 resize-none h-24" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bg_color" className="text-zinc-400">Background Color</Label>
              <Input id="bg_color" name="bg_color" type="color" defaultValue={project?.bg_color ?? '#0a0a14'} className="bg-zinc-900 border-zinc-800 h-10 w-full cursor-pointer px-1 py-1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accent_color" className="text-zinc-400">Accent Color</Label>
              <Input id="accent_color" name="accent_color" type="color" defaultValue={project?.accent_color ?? '#00f0ff'} className="bg-zinc-900 border-zinc-800 h-10 w-full cursor-pointer px-1 py-1" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="link_url" className="text-zinc-400">Link URL (Optional)</Label>
            <Input id="link_url" name="link_url" type="url" defaultValue={project?.link_url ?? ''} className="bg-zinc-900 border-zinc-800" />
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

export function DeleteProjectButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (confirm('Are you sure you want to delete this project?')) {
      startTransition(async () => {
        try {
          await deleteProject(id)
          toast.success('Project deleted')
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
