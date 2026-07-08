import type { ShowcaseProjection } from "../types";

import type {
  ShowcaseNarrative,
  ShowcaseNarrativeSection,
} from "./types";

function buildSection(
  title: string,
  statement: string,
  evidence: string[]
): ShowcaseNarrativeSection {
  return {
    title,
    statement,
    evidence,
  };
}

export function buildShowcaseNarrative(
  projection: ShowcaseProjection
): ShowcaseNarrative {
  return {
    title: "How Forge understood this situation",
    summary:
      "Forge transformed raw input into structured understanding while preserving uncertainty and human authorization boundaries.",
    sections: {
      noticed: buildSection(
        "What Forge noticed",
        "Forge identified meaningful signals from the original input.",
        [
          `${projection.understanding.people.items.length} people mention(s) identified.`,
          `${projection.understanding.obligations.items.length} possible obligation(s) identified.`,
          `${projection.understanding.emotions.items.length} possible emotion signal(s) identified.`,
          `${projection.understanding.possibleRelations.items.length} possible relationship(s) identified.`,
        ]
      ),

      significance: buildSection(
        "Why it mattered",
        "Forge evaluated the input through structured understanding rather than treating it as simple text.",
        projection.stages.map((stage) => stage.title)
      ),

      inference: buildSection(
        "What Forge inferred",
        "Forge created possible interpretations while preserving uncertainty.",
        [
          "Semantic understanding remained separate from raw input.",
          "Possible relationships remain possible rather than confirmed facts.",
        ]
      ),

      recommendation: buildSection(
        "What Forge recommended",
        "Forge recommendations are derived from reasoning and remain separate from execution.",
        [
          "No recommendation was created by this showcase projection.",
          "No recommendation is treated as a failure state.",
        ]
      ),

      authorization: buildSection(
        "What permission was considered",
        "Forge preserves human authorization boundaries before durable work exists.",
        [
          "This showcase does not authorize external actions.",
          "Human approval remains a required boundary.",
        ]
      ),

      outcome: buildSection(
        "What resulted",
        "Forge completed an explainable cognitive execution.",
        [
          `${projection.totalSteps} kernel execution step(s) recorded.`,
          `Execution ${projection.executionId} completed.`,
        ]
      ),
    },
  };
}
