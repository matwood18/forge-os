// lib/kernel/reflection/in-memory-reflection-repository.ts
import type { ReflectionRepository } from "./reflection-repository";
import type {
  ReflectionCreateInput,
  ReflectionRecord,
} from "./types";

export class InMemoryReflectionRepository
  implements ReflectionRepository
{
  private readonly reflections = new Map<string, ReflectionRecord>();

  async remember(
    reflection: ReflectionCreateInput
  ): Promise<ReflectionRecord> {
    const record: ReflectionRecord = {
      ...reflection,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    this.reflections.set(record.id, record);

    return record;
  }

  async forExecution(
    executionId: string
  ): Promise<ReflectionRecord[]> {
    return Array.from(this.reflections.values()).filter(
      (reflection) => reflection.executionId === executionId
    );
  }

  async all(): Promise<ReflectionRecord[]> {
    return Array.from(this.reflections.values());
  }
}