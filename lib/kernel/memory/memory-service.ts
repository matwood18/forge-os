import type { MemoryEngine } from "./memory-engine";
import type {
  MemoryAssertion,
  MemoryCreateInput,
  MemoryQuery,
  MemoryRecord,
} from "./types";

export class MemoryService {
  constructor(private readonly memoryEngine: MemoryEngine) {}

  remember(memory: MemoryCreateInput): Promise<MemoryRecord> {
    return this.memoryEngine.remember(memory);
  }

  rememberAssertion(assertion: MemoryAssertion): Promise<MemoryRecord> {
    return this.memoryEngine.rememberAssertion(assertion);
  }

  find(query: MemoryQuery): Promise<MemoryRecord[]> {
    return this.memoryEngine.find(query);
  }

  all(): Promise<MemoryRecord[]> {
    return this.memoryEngine.all();
  }
}