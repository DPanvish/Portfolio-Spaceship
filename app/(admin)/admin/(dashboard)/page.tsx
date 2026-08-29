export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="text-zinc-400 mt-2">Welcome back to the Spaceship OS control panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-4">
          <h2 className="text-lg font-semibold text-zinc-100">Projects Database</h2>
          <p className="text-sm text-zinc-400">
            Manage your selected work, configure 3D tilt cards, and set accent colors.
          </p>
        </div>
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-4">
          <h2 className="text-lg font-semibold text-zinc-100">Experience Timeline</h2>
          <p className="text-sm text-zinc-400">
            Update your work history, companies, and roles displayed on the timeline.
          </p>
        </div>
      </div>
    </div>
  )
}
