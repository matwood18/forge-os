import type {
  ExecutiveConcernIdentityInput,
  ExecutiveConcernIdentityResult,
} from "./types";

export interface ExecutiveConcernIdentityResolver {
  resolve(
    input: ExecutiveConcernIdentityInput
  ): ExecutiveConcernIdentityResult;
}
