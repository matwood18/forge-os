import type { DemoPipeline } from "./types";

export class DemoPipelineBuilder {
  build(): DemoPipeline {
    return {
      stages: [
        {
          id: "input",
          title: "Input",
          description: "The raw statement or interaction entering Forge.",
          artifacts: [],
        },
        {
          id: "events",
          title: "Events",
          description: "Domain events emitted by applications.",
          artifacts: [],
        },
        {
          id: "semantic-events",
          title: "Semantic Events",
          description: "Meaning-bearing events created by interpretation.",
          artifacts: [],
        },
        {
          id: "observations",
          title: "Observations",
          description: "Facts Forge notices from semantic activity.",
          artifacts: [],
        },
        {
          id: "relationships",
          title: "Relationships",
          description: "Connections inferred between entities.",
          artifacts: [],
        },
        {
          id: "memories",
          title: "Memories",
          description: "Durable semantic records Forge can recall later.",
          artifacts: [],
        },
        {
          id: "beliefs",
          title: "Beliefs",
          description: "Confidence-weighted claims built from evidence.",
          artifacts: [],
        },
        {
          id: "worldview",
          title: "Worldview",
          description: "Forge's current synthesized understanding.",
          artifacts: [],
        },
        {
          id: "arguments",
          title: "Arguments",
          description: "Reasoned positions generated from the worldview.",
          artifacts: [],
        },
        {
          id: "questions",
          title: "Questions",
          description: "Open loops and curiosities Forge still has.",
          artifacts: [],
        },
      ],
    };
  }
}