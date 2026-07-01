import type { Question } from "@/lib/domain";

export type IdentityResolutionAnswer = {
  question: Question;
  displayName: string;
};

export type IdentityResolutionEngineResult = {
  personId: string;
  displayName: string;
};

export interface IdentityResolutionEngine {
  answer(
    input: IdentityResolutionAnswer
  ): Promise<IdentityResolutionEngineResult>;
}