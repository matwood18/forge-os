export type ObservationRecord = {
  id: string;

  subjectEntityId: string;

  predicate: string;

  objectEntityId?: string | null;

  objectValue?: string | null;

  confidence: number;

  sourceEventId?: string | null;

  createdAt: Date;

  updatedAt: Date;
};

export type ObservationCreateInput = Omit<
  ObservationRecord,
  "id" | "createdAt" | "updatedAt"
>;

export interface ObservationRepository {
  remember(
    observation: ObservationCreateInput
  ): Promise<ObservationRecord>;

  forSubject(subjectEntityId: string): Promise<ObservationRecord[]>;

  all(): Promise<ObservationRecord[]>;
}