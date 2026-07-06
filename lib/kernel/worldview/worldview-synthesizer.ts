import type { Worldview, WorldviewInput } from "./types";

export interface WorldviewSynthesizer {
  synthesize(input: WorldviewInput): Worldview;
}