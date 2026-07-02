import type { ObservationRecord } from "@/lib/kernel/observation/observation-repository";

import { ObservationCard } from "@/components/observations/observation-card";
import { groupObservations } from "@/lib/group-observations";

interface ObservationRendererProps {
  observations: ObservationRecord[];
}

export function ObservationRenderer({
  observations,
}: ObservationRendererProps) {
  if (observations.length === 0) {
    return (
      <p className="text-zinc-500">
        Forge has not recorded observations for this person yet.
      </p>
    );
  }

  const groups = groupObservations(observations);

  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <section key={group.title}>
          <div className="mb-6 flex items-center gap-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
              {group.title}
            </h3>

            <div className="h-px flex-1 bg-zinc-800" />
          </div>

          <div className="space-y-3">
            {group.observations.map((observation) => (
              <ObservationCard
                key={observation.id}
                observation={observation}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}