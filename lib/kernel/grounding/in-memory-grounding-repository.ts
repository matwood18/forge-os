// lib/kernel/grounding/in-memory-grounding-repository.ts
import type { GroundingRepository } from "./grounding-repository";
import type { GroundingRecord } from "./types";

export class InMemoryGroundingRepository implements GroundingRepository {
  private readonly records: GroundingRecord[] = [];

  async save(record: GroundingRecord): Promise<GroundingRecord> {
    this.records.push(record);

    return record;
  }

  async list(): Promise<GroundingRecord[]> {
    return [...this.records];
  }
}