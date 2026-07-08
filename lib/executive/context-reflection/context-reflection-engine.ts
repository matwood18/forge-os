import type {
  ContextReflectionInput,
  PersonalContextReflection,
} from "./types";

export interface ContextReflectionEngine {
  reflect(
    input: ContextReflectionInput
  ): Promise<PersonalContextReflection>;
}
