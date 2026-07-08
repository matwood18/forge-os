import type { ShowcaseNarrative } from "@/lib/showcase";

const sections = [
  "noticed",
  "significance",
  "inference",
  "recommendation",
  "authorization",
  "outcome",
] as const;

export function ShowcaseNarrative({
  narrative,
}: {
  narrative?: ShowcaseNarrative;
}) {
  if (!narrative) {
    return null;
  }

  return (
    <section className="mt-8 rounded-3xl border border-cyan-500/20 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/20">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">
          Forge Narrative
        </p>

        <h2 className="mt-4 text-3xl font-bold text-slate-100">
          {narrative.title}
        </h2>

        <p className="mt-3 max-w-4xl text-slate-400">
          {narrative.summary}
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {sections.map((key) => {
          const section = narrative.sections[key];

          return (
            <div
              key={key}
              className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
                {section.title}
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                {section.statement}
              </p>

              <div className="mt-4 space-y-2">
                {section.evidence.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-400"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
