import type { ObservationRecord } from "@/lib/kernel/observation/observation-repository";

export type ObservationIconName =
  | "status"
  | "task"
  | "completed"
  | "interaction"
  | "note"
  | "summary"
  | "default";

export type ObservationRendererName =
  | "default"
  | "status"
  | "task"
  | "interaction"
  | "summary";

export interface ObservationDefinition {
  label: string;
  icon: ObservationIconName;
  renderer: ObservationRendererName;
  tone: string;
}

const observationRegistry: Record<string, ObservationDefinition> = {
  status: {
    label: "Status Change",
    icon: "status",
    renderer: "status",
    tone: "border-amber-400/40 bg-amber-400/10",
  },
  status_changed: {
    label: "Status Change",
    icon: "status",
    renderer: "status",
    tone: "border-amber-400/40 bg-amber-400/10",
  },
  task: {
    label: "Task Created",
    icon: "task",
    renderer: "task",
    tone: "border-blue-400/40 bg-blue-400/10",
  },
  task_created: {
    label: "Task Created",
    icon: "task",
    renderer: "task",
    tone: "border-blue-400/40 bg-blue-400/10",
  },
  completed: {
    label: "Task Completed",
    icon: "completed",
    renderer: "task",
    tone: "border-green-400/40 bg-green-400/10",
  },
  task_completed: {
    label: "Task Completed",
    icon: "completed",
    renderer: "task",
    tone: "border-green-400/40 bg-green-400/10",
  },
  interaction: {
    label: "Interaction",
    icon: "interaction",
    renderer: "interaction",
    tone: "border-purple-400/40 bg-purple-400/10",
  },
  interaction_logged: {
    label: "Interaction",
    icon: "interaction",
    renderer: "interaction",
    tone: "border-purple-400/40 bg-purple-400/10",
  },
  note: {
    label: "Note",
    icon: "note",
    renderer: "default",
    tone: "border-zinc-700 bg-zinc-900",
  },
  summary: {
    label: "Summary",
    icon: "summary",
    renderer: "summary",
    tone: "border-cyan-400/40 bg-cyan-400/10",
  },
};

export function getObservationDefinition(
  observation: ObservationRecord,
): ObservationDefinition {
  return (
    observationRegistry[observation.predicate] ?? {
      label: formatPredicate(observation.predicate),
      icon: "default",
      renderer: "default",
      tone: "border-zinc-800 bg-zinc-900",
    }
  );
}

function formatPredicate(predicate: string) {
  return predicate
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}