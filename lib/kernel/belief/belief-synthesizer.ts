import type { MemoryRecord } from "@/lib/kernel/memory";

import type { Belief } from "./types";

export interface BeliefSynthesizer {
  synthesize(memories: MemoryRecord[]): Belief[];
}