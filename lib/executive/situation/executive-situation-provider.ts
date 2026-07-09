import type {
  ExecutiveSituationInput,
  ExecutiveSituationResult,
} from "./types";

export interface ExecutiveSituationProvider {
  interpret(
    input: ExecutiveSituationInput
  ): Promise<ExecutiveSituationResult>;
}
