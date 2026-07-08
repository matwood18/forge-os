// lib/kernel/grounding/grounding-engine.ts
import type { GroundingEngineInput, GroundingEngineResult } from "./types";

export interface GroundingEngine {
  ground(input: GroundingEngineInput): Promise<GroundingEngineResult>;
}