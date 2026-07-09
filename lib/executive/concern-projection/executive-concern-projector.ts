import type {
  ExecutiveConcernProjectionInput,
  ExecutiveConcernProjectionResult,
} from "./types";

export interface ExecutiveConcernProjector {
  project(input: ExecutiveConcernProjectionInput): ExecutiveConcernProjectionResult;
}

