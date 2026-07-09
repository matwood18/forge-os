import type {
  ExecutiveConcernCoordinationInput,
  ExecutiveConcernCoordinationResult,
} from "./types";

export interface ExecutiveConcernCoordinator {
  coordinate(
    input: ExecutiveConcernCoordinationInput
  ): Promise<ExecutiveConcernCoordinationResult>;
}
