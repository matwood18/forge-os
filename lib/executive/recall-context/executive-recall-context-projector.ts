import type { ExecutiveRecallResult } from "../recall";
import type { ExecutiveRecallContext } from "./types";

export interface ExecutiveRecallContextProjector {
  project(input: ExecutiveRecallResult): ExecutiveRecallContext;
}
