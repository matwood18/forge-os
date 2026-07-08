// lib/kernel/interpretation/in-memory-interpretation-repository.ts
import type { InterpretationRecord } from "./interpretation-record";
import type { InterpretationRepository } from "./interpretation-repository";

export class InMemoryInterpretationRepository
  implements InterpretationRepository
{
  private readonly records: InterpretationRecord[] = [];

  async save(record: InterpretationRecord): Promise<void> {
    this.records.push(record);
  }

  async all(): Promise<InterpretationRecord[]> {
    return [...this.records];
  }

  async findBySourceEventId(
    sourceEventId: string
  ): Promise<InterpretationRecord[]> {
    return this.records.filter(
      (record) => record.sourceEvent.id === sourceEventId
    );
  }
}