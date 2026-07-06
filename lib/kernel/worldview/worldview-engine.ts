import { BasicWorldviewSynthesizer } from "./basic-worldview-synthesizer";
import type { WorldviewSynthesizer } from "./worldview-synthesizer";
import type { WorldviewInput, WorldviewResult } from "./types";

export class WorldviewEngine {
  constructor(
    private readonly worldviewSynthesizer: WorldviewSynthesizer =
      new BasicWorldviewSynthesizer()
  ) {}

  synthesize(input: WorldviewInput): WorldviewResult {
    return {
      worldview: this.worldviewSynthesizer.synthesize(input),
    };
  }
}