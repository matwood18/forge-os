import type { ObservationRecord } from "@/lib/kernel/observation/observation-repository";

import { DefaultObservation } from "@/components/observations/renderers/default-observation";

interface SummaryObservationProps {
  observation: ObservationRecord;
}

export function SummaryObservation({ observation }: SummaryObservationProps) {
  return <DefaultObservation observation={observation} />;
}