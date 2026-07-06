import type { Worldview, WorldviewInput } from "./types";
import type { WorldviewSynthesizer } from "./worldview-synthesizer";

export class BasicWorldviewSynthesizer implements WorldviewSynthesizer {
  synthesize(input: WorldviewInput): Worldview {
    return {
      generatedAt: new Date(),
      beliefs: input.beliefs,
    };
  }
}