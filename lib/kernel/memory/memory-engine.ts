import type { MemoryRepository } from "./memory-repository";
import type {
  MemoryCreateInput,
  MemoryQuery,
  MemoryRecord,
} from "./types";

export class MemoryEngine {
  constructor(private readonly memoryRepository: MemoryRepository) {}

  remember(memory: MemoryCreateInput): Promise<MemoryRecord> {
    return this.memoryRepository.remember(memory);
  }

  find(query: MemoryQuery): Promise<MemoryRecord[]> {
    return this.memoryRepository.find(query);
  }

  all(): Promise<MemoryRecord[]> {
    return this.memoryRepository.all();
  }
}