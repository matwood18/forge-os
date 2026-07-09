import type {
  ExecutiveAttentionMemoryRecord,
} from "./types";

export interface ExecutiveAttentionMemoryStore {
  remember(
    record: ExecutiveAttentionMemoryRecord
  ): void;

  find(
    subjectKey: string
  ): ExecutiveAttentionMemoryRecord | undefined;

  all(): ExecutiveAttentionMemoryRecord[];

  clear(): void;
}
