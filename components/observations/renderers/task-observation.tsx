import type { ObservationRecord } from "@/lib/kernel/observation/observation-repository";

import { DefaultObservation } from "@/components/observations/renderers/default-observation";

interface TaskObservationProps {
  observation: ObservationRecord;
}

export function TaskObservation({ observation }: TaskObservationProps) {
  return <DefaultObservation observation={observation} />;
}