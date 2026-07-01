export type IntentionModeId = "execute" | "connect" | "grow" | "balance";

export type IntentionMode = {
  id: IntentionModeId;
  label: string;
  description: string;
};

export const intentionModes: IntentionMode[] = [
  {
    id: "execute",
    label: "Execute",
    description: "Clear commitments, finish work, and move tasks forward.",
  },
  {
    id: "connect",
    label: "Connect",
    description: "Invest in people and strengthen relationships.",
  },
  {
    id: "grow",
    label: "Grow",
    description: "Pursue opportunities, learning, sales, and momentum.",
  },
  {
    id: "balance",
    label: "Balance",
    description: "Let Forge weigh tasks, relationships, and opportunities together.",
  },
];