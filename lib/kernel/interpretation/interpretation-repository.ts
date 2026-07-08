// lib/kernel/interpretation/interpretation-repository.ts
import type { InterpretationRecord } from "./interpretation-record";

export interface InterpretationRepository {
  save(record: InterpretationRecord): Promise<void>;
  all(): Promise<InterpretationRecord[]>;
  findBySourceEventId(sourceEventId: string): Promise<InterpretationRecord[]>;
}