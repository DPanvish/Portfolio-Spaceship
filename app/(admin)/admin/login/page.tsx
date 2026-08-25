import { login, signup } from './actions'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function LoginPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams
  const error = typeof resolvedSearchParams?.error === 'string' ? resolvedSearchParams.error : undefined

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950">
      <div className="w-full max-w-sm p-8 space-y-6 bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Admin Access
          </h1>
          <p className="text-sm text-zinc-500">
            Enter your credentials to access the terminal
          </p>
          {error && (
            <p className="text-sm text-red-500 mt-2 bg-red-500/10 border border-red-500/20 p-2 rounded-md">
              {error}
            </p>
          )}
        </div>
        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-zinc-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-md text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-zinc-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-md text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>
          <div className="flex flex-col space-y-2 pt-2">
            <button
              formAction={login}
              className="w-full px-4 py-2 text-sm font-medium text-zinc-950 bg-cyan-400 rounded-md hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-colors"
            >
              Log In
            </button>
            <button
              formAction={signup}
              className="w-full px-4 py-2 text-sm font-medium text-zinc-300 bg-transparent border border-zinc-700 rounded-md hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500/50 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
