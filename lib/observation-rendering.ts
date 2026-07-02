import type { ObservationRecord } from "@/lib/kernel/observation/observation-repository";

import { getObservationDefinition } from "@/lib/observation-registry";

export function getObservationIconName(observation: ObservationRecord) {
  return getObservationDefinition(observation).icon;
}

export function getObservationLabel(observation: ObservationRecord) {
  return getObservationDefinition(observation).label;
}

export function getObservationTone(observation: ObservationRecord) {
  return getObservationDefinition(observation).tone;
}