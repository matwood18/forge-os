import type {
  ExecutiveAttentionTransitionEngine,
} from "./executive-attention-transition-engine";

import type {
  ExecutiveAttentionTransitionInput,
  ExecutiveAttentionTransitionExplanation,
} from "./types";

export class BasicExecutiveAttentionTransitionEngine
  implements ExecutiveAttentionTransitionEngine
{
  explain(
    input: ExecutiveAttentionTransitionInput
  ): ExecutiveAttentionTransitionExplanation {
    switch (input.transition) {
      case "surfaced_to_quiet":
        return {
          transition: input.transition,
          summary:
            "Attention transitioned from surfaced to quiet.",
          changed: true,
        };

      case "quiet_to_surfaced":
        return {
          transition: input.transition,
          summary:
            "Attention transitioned from quiet to surfaced.",
          changed: true,
        };

      case "unchanged":
        return {
          transition: input.transition,
          summary:
            "Attention remained unchanged.",
          changed: false,
        };

      case "no_previous_state":
        return {
          transition: input.transition,
          summary:
            "No previous attention state existed.",
          changed: false,
        };
    }
  }
}
