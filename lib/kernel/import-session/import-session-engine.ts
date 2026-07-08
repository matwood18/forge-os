// lib/kernel/import-session/import-session-engine.ts
import type {
  ImportSession,
  ImportSessionCompletionInput,
  ImportSessionCreateInput,
  ImportSessionProgressInput,
} from "./types";

export interface ImportSessionEngine {
  create(input: ImportSessionCreateInput): Promise<ImportSession>;
  start(sessionId: string): Promise<ImportSession>;
  recordProgress(input: ImportSessionProgressInput): Promise<ImportSession>;
  complete(input: ImportSessionCompletionInput): Promise<ImportSession>;
}
