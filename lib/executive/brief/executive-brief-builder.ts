import type { ShowcaseProjection } from "@/lib/showcase";

import type {
  ExecutiveBrief,
  ExecutivePriority,
} from "./types";

export interface ExecutiveBriefBuilder {
  build(
    projection: ShowcaseProjection
  ): ExecutiveBrief;
}

export class BasicExecutiveBriefBuilder
  implements ExecutiveBriefBuilder
{
  build(
    projection: ShowcaseProjection
  ): ExecutiveBrief {
    const priorities: ExecutivePriority[] = [];

    const obligations =
      projection.understanding.obligations.items;

    const emotions =
      projection.understanding.emotions.items;

    const relations =
      projection.understanding.possibleRelations.items;

    if (obligations.length > 0) {
      priorities.push({
        title: obligations[0].label,

        whyItMatters:
          "Forge detected a possible unresolved obligation that may deserve attention.",

        suggestedNextStep:
          "Consider reviewing the outstanding obligation.",

        evidence: obligations.map(
          (item) => item.summary
        ),
      });
    }

    if (emotions.length > 0 || relations.length > 0) {
      priorities.push({
        title: "Possible relationship impact",

        whyItMatters:
          "Forge detected signals that may indicate another person or relationship is affected.",

        suggestedNextStep:
          "Consider whether communication or clarification would help.",

        evidence: [
          ...emotions.map(
            (item) => item.summary
          ),
          ...relations.map(
            (item) => item.summary
          ),
        ],
      });
    }

    return {
      title: "Forge Executive Brief",

      summary:
        priorities.length > 0
          ? "Forge identified areas that may deserve your attention."
          : "Forge did not identify major attention areas from this input.",

      priorities,

      createdAt: new Date(),
    };
  }
}
