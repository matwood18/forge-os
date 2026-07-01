export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-8">

        <h1 className="text-7xl font-bold tracking-tight">
          Forge
        </h1>

        <p className="mt-4 text-xl text-zinc-400">
          Your business memory.
        </p>

        <div className="mt-16 grid grid-cols-4 gap-6">

          <div className="rounded-2xl bg-zinc-900 p-6">
            <h2 className="text-sm uppercase text-zinc-500">
              People
            </h2>

            <p className="mt-3 text-4xl font-bold">
              0
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900 p-6">
            <h2 className="text-sm uppercase text-zinc-500">
              Interactions
            </h2>

            <p className="mt-3 text-4xl font-bold">
              0
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900 p-6">
            <h2 className="text-sm uppercase text-zinc-500">
              Follow Ups
            </h2>

            <p className="mt-3 text-4xl font-bold">
              0
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900 p-6">
            <h2 className="text-sm uppercase text-zinc-500">
              Opportunities
            </h2>

            <p className="mt-3 text-4xl font-bold">
              0
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}