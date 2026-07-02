import type {
  ObservationCreateInput,
  ObservationRecord,
  ObservationRepository,
} from "./observation-repository";

export class InMemoryObservationRepository implements ObservationRepository {
  private observations: ObservationRecord[] = [];

  async remember(
    observation: ObservationCreateInput
  ): Promise<ObservationRecord> {
    const now = new Date();

    const record: ObservationRecord = {
      ...observation,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    this.observations.push(record);

    return record;
  }

  async forSubject(subjectEntityId: string): Promise<ObservationRecord[]> {
    return this.observations.filter(
      (observation) => observation.subjectEntityId === subjectEntityId
    );
  }

  async all(): Promise<ObservationRecord[]> {
    return [...this.observations];
  }
}