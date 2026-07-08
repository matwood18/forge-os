export type ContextReflectionImportance =
  | "low"
  | "medium"
  | "high";

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
  signals: {
    kind: string;
    label: string;
    confidence: number;
  }[];
};
