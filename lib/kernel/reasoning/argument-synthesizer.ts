import type { Argument, CandidateArgument } from "./types";

export interface ArgumentSynthesizer {
  synthesize(candidates: CandidateArgument[]): Promise<Argument[]>;
}