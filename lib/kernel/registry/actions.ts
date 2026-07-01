export type ForgeActionId =
  | "create-person"
  | "create-task"
  | "log-event"
  | "create-memory"
  | "review-interpretations"
  | "open-attention-briefing";

export type ForgeAction = {
  id: ForgeActionId;
  label: string;
  description: string;
};

export const actions: ForgeAction[] = [
  {
    id: "create-person",
    label: "Create Person",
    description: "Add a new human relationship to Forge.",
  },
  {
    id: "create-task",
    label: "Create Task",
    description: "Create an intentional action.",
  },
  {
    id: "log-event",
    label: "Log Event",
    description: "Record something that happened.",
  },
  {
    id: "create-memory",
    label: "Create Memory",
    description: "Capture durable understanding about a person or relationship.",
  },
  {
    id: "review-interpretations",
    label: "Review Interpretations",
    description: "Review Forge's current understanding of recent events.",
  },
  {
    id: "open-attention-briefing",
    label: "Open Attention Briefing",
    description: "See what deserves attention right now.",
  },
];