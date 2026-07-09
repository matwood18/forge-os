import type {
  ExecutiveSelectionInput,
  ExecutiveSelectionResult,
} from "./types";

export interface ExecutiveSelectionEngine {
  select(input: ExecutiveSelectionInput): ExecutiveSelectionResult;
}
