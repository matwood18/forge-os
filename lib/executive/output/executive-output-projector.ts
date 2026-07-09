import type { ClarificationRequest } from "@/lib/executive/clarification";
import type { Suggestion } from "@/lib/executive/suggestion";

import type { ExecutiveOutput } from "./types";

export type ExecutiveOutputProjectionInput = {
  suggestions: Suggestion[];
  clarifications: ClarificationRequest[];
  generatedAt?: Date;
};

export interface ExecutiveOutputProjector {
  project(input: ExecutiveOutputProjectionInput): ExecutiveOutput;
}
