import { ForgeKernel } from "@/lib/kernel";

export default async function KernelTestPage() {
  const forge = new ForgeKernel();

  const result = await forge.ingest({
    source: "manual",
    type: "manual.note",
    payload: {
      text: "Met John at APA pool tonight.",
    },
  });

  const reasoning = await forge.reason("Met John at APA pool tonight.");

  const events = await forge.events();

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Kernel Smoke Test</h1>

      <div className="grid gap-6">
        <section>
          <h2 className="mb-2 text-lg font-semibold">Ingest Result</h2>
          <pre className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300">
            {JSON.stringify(result, null, 2)}
          </pre>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">Reasoning Result</h2>
          <pre className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300">
            {JSON.stringify(reasoning, null, 2)}
          </pre>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">Stored Events</h2>
          <pre className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300">
            {JSON.stringify(events, null, 2)}
          </pre>
        </section>
      </div>
    </div>
  );
}