import type {
  ExecutiveAttentionMemoryRecord,
} from "./types";

import type {
  ExecutiveAttentionMemoryStore,
} from "./attention-memory-store";

export class InMemoryAttentionMemoryStore
  implements ExecutiveAttentionMemoryStore
{
  private readonly records = new Map<
    string,
    ExecutiveAttentionMemoryRecord
  >();

  remember(
    record: ExecutiveAttentionMemoryRecord
  ): void {
    this.records.set(record.subjectKey, record);
  }

  find(
    subjectKey: string
  ): ExecutiveAttentionMemoryRecord | undefined {
    return this.records.get(subjectKey);
  }

  all(): ExecutiveAttentionMemoryRecord[] {
    return Array.from(this.records.values());
  }

  clear(): void {
    this.records.clear();
  }
}

export const executiveAttentionMemoryStore =
  new InMemoryAttentionMemoryStore();
