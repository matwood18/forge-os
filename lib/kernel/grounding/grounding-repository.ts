// lib/kernel/grounding/grounding-repository.ts
import type { GroundingRecord } from "./types";

export interface GroundingRepository {
  save(record: GroundingRecord): Promise<GroundingRecord>;
  list(): Promise<GroundingRecord[]>;
}