import { BasicBeliefSynthesizer } from "./basic-belief-synthesizer";
import type { BeliefSynthesizer } from "./belief-synthesizer";
import type { BeliefFormationInput, BeliefFormationResult } from "./types";

export class BeliefEngine {
  constructor(
    private readonly beliefSynthesizer: BeliefSynthesizer =
      new BasicBeliefSynthesizer()
  ) {}

  formBeliefs(input: BeliefFormationInput): BeliefFormationResult {
    return {
      beliefs: this.beliefSynthesizer.synthesize(input.memories),
    };
  }
}