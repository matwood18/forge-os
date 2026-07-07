// lib/kernel/authorization/authorization-engine.ts
import type {
  AuthorizationInput,
  AuthorizationResult,
} from "./types";

export interface AuthorizationEngine {
  evaluate(
    input: AuthorizationInput
  ): Promise<AuthorizationResult>;
}