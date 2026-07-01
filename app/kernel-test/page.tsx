import { runIdentityResolutionSmokeTest } from "@/lib/kernel";

export default async function KernelTestPage() {
  const result = await runIdentityResolutionSmokeTest();

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Kernel Smoke Test</h1>

      <pre className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}