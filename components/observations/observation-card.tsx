import type { ObservationRecord } from "@/lib/kernel/observation/observation-repository";

import { DefaultObservation } from "@/components/observations/renderers/default-observation";
import { InteractionObservation } from "@/components/observations/renderers/interaction-observation";
import { StatusObservation } from "@/components/observations/renderers/status-observation";
import { SummaryObservation } from "@/components/observations/renderers/summary-observation";
import { TaskObservation } from "@/components/observations/renderers/task-observation";
import { getObservationDefinition } from "@/lib/observation-registry";

interface ObservationCardProps {
  observation: ObservationRecord;
}

export function ObservationCard({ observation }: ObservationCardProps) {
  const definition = getObservationDefinition(observation);

  switch (definition.renderer) {
    case "status":
      return <StatusObservation observation={observation} />;

    case "interaction":
      return <InteractionObservation observation={observation} />;

    case "task":
      return <TaskObservation observation={observation} />;

    case "summary":
      return <SummaryObservation observation={observation} />;

    default:
      return <DefaultObservation observation={observation} />;
  }
}