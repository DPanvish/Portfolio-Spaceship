import { createClient } from '@/lib/supabase/server';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ExperienceDialog, DeleteExperienceButton } from './ExperienceForm';

export default async function ExperienceAdminPage() {
  const supabase = await createClient();
  const { data: experiences } = await supabase
    .from('experience')
    .select('*')
    .order('sort_order', { ascending: true });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Experience</h1>
          <p className="text-zinc-400 mt-2">Manage the work history displayed on your timeline.</p>
        </div>
        <ExperienceDialog />
      </div>

      <div className="border border-zinc-800 rounded-md bg-zinc-900/50">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="w-[80px] text-zinc-400">Order</TableHead>
              <TableHead className="text-zinc-400">Role</TableHead>
              <TableHead className="text-zinc-400">Company</TableHead>
              <TableHead className="text-zinc-400">Period</TableHead>
              <TableHead className="text-right text-zinc-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiences?.map((exp) => (
              <TableRow key={exp.id} className="border-zinc-800 hover:bg-zinc-800/50">
                <TableCell className="font-mono text-zinc-500">{exp.sort_order}</TableCell>
                <TableCell className="font-medium text-zinc-200">{exp.role}</TableCell>
                <TableCell className="text-zinc-400">{exp.company}</TableCell>
                <TableCell className="text-zinc-400 font-mono text-sm">{exp.period}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <ExperienceDialog exp={exp} />
                    <DeleteExperienceButton id={exp.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!experiences?.length && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-zinc-500">
                  No experience records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
