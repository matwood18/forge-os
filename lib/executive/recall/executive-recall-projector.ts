import type { ExecutiveRecallInput, ExecutiveRecallResult } from "./types";

export interface ExecutiveRecallProjector {
  project(input: ExecutiveRecallInput): Promise<ExecutiveRecallResult>;
}
