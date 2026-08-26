import { createClient } from '@/lib/supabase/server';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProjectDialog, DeleteProjectButton } from './ProjectForm';

export default async function ProjectsAdminPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Projects</h1>
          <p className="text-zinc-400 mt-2">Manage the selected work displayed on your portfolio.</p>
        </div>
        <ProjectDialog />
      </div>

      <div className="border border-zinc-800 rounded-md bg-zinc-900/50">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="w-[80px] text-zinc-400">Order</TableHead>
              <TableHead className="text-zinc-400">Title</TableHead>
              <TableHead className="text-zinc-400">Category</TableHead>
              <TableHead className="text-zinc-400">Colors</TableHead>
              <TableHead className="text-right text-zinc-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects?.map((project) => (
              <TableRow key={project.id} className="border-zinc-800 hover:bg-zinc-800/50">
                <TableCell className="font-mono text-zinc-500">{project.sort_order}</TableCell>
                <TableCell className="font-medium text-zinc-200">{project.title}</TableCell>
                <TableCell className="text-zinc-400">{project.category}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full border border-zinc-700" 
                      style={{ backgroundColor: project.bg_color }}
                      title={`Background: ${project.bg_color}`}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-zinc-700" 
                      style={{ backgroundColor: project.accent_color }}
                      title={`Accent: ${project.accent_color}`}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <ProjectDialog project={project} />
                    <DeleteProjectButton id={project.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!projects?.length && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-zinc-500">
                  No projects found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
