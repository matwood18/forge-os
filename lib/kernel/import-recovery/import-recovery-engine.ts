import type {
  ImportRecoveryDecision,
  ImportRecoveryInput,
} from "./types";

export interface ImportRecoveryEngine {
  evaluate(
    input: ImportRecoveryInput
  ): ImportRecoveryDecision;
}
