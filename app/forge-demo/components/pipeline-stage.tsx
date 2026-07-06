import type { DemoStage } from "@/lib/demo";

type PipelineStageProps = {
  stage: DemoStage;
};

export function PipelineStage({ stage }: PipelineStageProps) {
  const artifactCount = stage.artifacts.length;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">
            {stage.title}
          </h2>

          {stage.description ? (
            <p className="mt-1 text-sm text-slate-400">
              {stage.description}
            </p>
          ) : null}
        </div>

        <div className="rounded-full border border-slate-800 px-3 py-1 text-xs font-medium text-slate-400">
          {artifactCount} {artifactCount === 1 ? "artifact" : "artifacts"}
        </div>
      </div>

      <div className="mt-4">
        {artifactCount > 0 ? (
          <div className="space-y-3">
            {stage.artifacts.map((artifact) => (
              <article
                key={artifact.id}
                className="rounded-xl border border-slate-800 bg-slate-900/70 p-4"
              >
                <h3 className="text-sm font-semibold text-slate-100">
                  {artifact.title}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {artifact.summary}
                </p>

                {artifact.details && artifact.details.length > 0 ? (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-500">
                    {artifact.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-500">
            No artifacts.
          </p>
        )}
      </div>
    </section>
  );
}