import type {
  ExecutiveComparisonInput,
  ExecutiveComparisonResult,
} from "./types";

export interface ExecutiveComparisonEngine {
  compare(input: ExecutiveComparisonInput): ExecutiveComparisonResult;
}
