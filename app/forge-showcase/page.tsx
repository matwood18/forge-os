// app/forge-showcase/page.tsx

const compilerStages = [
  {
    label: "Interpretation",
    summary: "Forge detects meaning.",
    items: ["concern", "relationship impact", "unresolved obligation"],
  },
  {
    label: "Entity Mentions",
    summary: "Forge identifies what is being referenced.",
    items: ["Jess", "me", "contacting insurance"],
  },
  {
    label: "Grounding",
    summary: "Forge separates known entities from unresolved references.",
    items: ["Jess → unresolved person", "me → current operator", "insurance → obligation context"],
  },
  {
    label: "Action Awareness",
    summary: "Forge prepares durable intended work instead of blindly acting.",
    items: ["call insurance", "repair relationship tension", "ask before taking action"],
  },
];

const futureCapabilities = [
  "Remember recurring obligations",
  "Notice repeated failure patterns",
  "Connect people, tasks, and consequences",
  "Recommend next actions with reasoning",
  "Require authorization before acting",
];

export default function ForgeShowcasePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">
            Forge OS
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-bold tracking-tight">
            An AI operating system that turns messy life input into structured
            knowledge and safe action.
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">
            Forge is not just chatting. It is compiling language into meaning,
            references, grounded knowledge, recommendations, authorization
            decisions, and durable intended work.
          </p>
        </header>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            Example input
          </p>

          <div className="mt-4 rounded-2xl bg-slate-950 p-6 text-2xl font-semibold text-slate-100">
            “Jess is mad at me for not contacting insurance.”
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-4">
          {compilerStages.map((stage) => (
            <div
              key={stage.label}
              className="rounded-3xl border border-slate-800 bg-slate-900 p-5"
            >
              <p className="text-sm font-semibold text-cyan-300">
                {stage.label}
              </p>

              <p className="mt-2 text-sm text-slate-400">{stage.summary}</p>

              <ul className="mt-5 space-y-3">
                {stage.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200"
                  >
                    ✓ {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              What Forge is becoming
            </p>

            <h2 className="mt-4 text-3xl font-bold">
              A knowledge compiler for real life.
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              Forge separates understanding from memory, memory from reasoning,
              reasoning from recommendations, and recommendations from action.
              That separation is what makes it trustworthy.
            </p>

            <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-5">
              <p className="text-sm font-semibold text-cyan-200">
                Emerging capability
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Soon, Forge should recognize that Jess is a person, insurance is
                an obligation context, and repeated missed obligations may
                affect a relationship.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Coming next
            </p>

            <ul className="mt-5 space-y-3">
              {futureCapabilities.map((capability) => (
                <li
                  key={capability}
                  className="rounded-2xl bg-slate-950 px-4 py-3 text-sm text-slate-200"
                >
                  {capability}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <footer className="mt-10 text-sm text-slate-500">
          Debug/proof view remains available at{" "}
          <span className="font-mono text-slate-300">/forge-demo</span>.
        </footer>
      </div>
    </main>
  );
}