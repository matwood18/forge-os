import type {
  ExecutivePresentationInput,
  PresentedExecutiveSuggestion,
} from "./types";

export interface ExecutivePresentationProjector {
  project(
    input: ExecutivePresentationInput
  ): PresentedExecutiveSuggestion[];
}
