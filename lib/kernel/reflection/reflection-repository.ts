// lib/kernel/reflection/reflection-repository.ts
import type {
  ReflectionCreateInput,
  ReflectionRecord,
} from "./types";

export interface ReflectionRepository {
  remember(
    reflection: ReflectionCreateInput
  ): Promise<ReflectionRecord>;

  forExecution(executionId: string): Promise<ReflectionRecord[]>;

  all(): Promise<ReflectionRecord[]>;
}