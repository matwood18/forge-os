import type { CuriosityInput, CuriosityResult } from "./types";

export interface CuriosityEngine {
  generate(input: CuriosityInput): Promise<CuriosityResult>;
}