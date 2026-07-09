export type ContextReflectionImportance =
  | "low"
  | "medium"
  | "high";

export type ContextReflectionSignal = {
  kind: string;
  label: string;
  summary: string;
  confidence: number;
  payload: Record<string, unknown>;
};

export type PersonalContextReflection = {
  id: string;

  summary: string;

  evidence: {
    sourceEventId: string;
    signals: string[];
  };

  importance: ContextReflectionImportance;

  confidence: number;

  createdAt: Date;
};

export type ContextReflectionInput = {
  eventId: string;
  signals: ContextReflectionSignal[];
};
