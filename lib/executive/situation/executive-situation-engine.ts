import type {
  ExecutiveSituationInput,
  ExecutiveSituationResult,
} from "./types";

export interface ExecutiveSituationEngine {
  interpret(
    input: ExecutiveSituationInput
  ): Promise<ExecutiveSituationResult>;
}
