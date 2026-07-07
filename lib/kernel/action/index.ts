// lib/kernel/action/index.ts
export type {
  ActionCreateInput,
  ActionKind,
  ActionRecord,
  ActionStatus,
} from "./types";

export type { ActionRepository } from "./action-repository";

export type {
  ActionMaterializationEngine,
  ActionMaterializationInput,
  ActionMaterializationResult,
} from "./action-materialization-engine";

export { BasicActionMaterializationEngine } from "./basic-action-materialization-engine";
export { InMemoryActionRepository } from "./in-memory-action-repository";