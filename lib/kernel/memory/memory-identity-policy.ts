import type { MemoryCreateInput, MemoryRecord } from "./types";

export interface MemoryIdentityPolicy {
  isSameBelief(
    existing: MemoryRecord,
    incoming: MemoryCreateInput
  ): boolean;
}

export class ExactMemoryIdentityPolicy implements MemoryIdentityPolicy {
  isSameBelief(
    existing: MemoryRecord,
    incoming: MemoryCreateInput
  ): boolean {
    return (
      existing.kind === incoming.kind &&
      existing.subjectEntityId === incoming.subjectEntityId &&
      existing.predicate === incoming.predicate &&
      normalizeNullable(existing.objectEntityId) ===
        normalizeNullable(incoming.objectEntityId) &&
      normalizeNullable(existing.objectValue) ===
        normalizeNullable(incoming.objectValue)
    );
  }
}

function normalizeNullable(value: string | null | undefined): string | null {
  return value ?? null;
}