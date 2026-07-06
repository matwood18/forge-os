import type { ReasoningContext } from "./reasoning-context";
import type { CandidateArgument } from "./types";

export interface ArgumentGenerator {
  generate(context: ReasoningContext): Promise<CandidateArgument[]>;
}