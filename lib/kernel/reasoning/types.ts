export type ObservationKind =
  | "possible-person"
  | "possible-organization"
  | "possible-location"
  | "activity"
  | "unknown";

export type Observation = {
  id: string;
  kind: ObservationKind;
  value: string;
  confidence: number;
  reason: string;
};

export type ReasoningInput = {
  text: string;
};

export type ReasoningResult = {
  observations: Observation[];
};