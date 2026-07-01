import { ForgeKernel } from "@/lib/kernel";

export default async function KernelTestPage() {
  const forge = new ForgeKernel();

  await forge.capture("Met John at APA pool tonight.");

  const questions = await forge.questions();

  const answerResult =
    questions[0] !== undefined
      ? await forge.answerIdentityQuestion(questions[0], "John Davis")
      : null;

  const events = await forge.events();

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Kernel Smoke Test</h1>

      <div className="grid gap-6">
        <section>
          <h2 className="mb-2 text-lg font-semibold">Questions</h2>
          <pre className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300">
            {JSON.stringify(questions, null, 2)}
          </pre>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">Answer Result</h2>
          <pre className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300">
            {JSON.stringify(answerResult, null, 2)}
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