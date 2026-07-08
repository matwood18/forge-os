// lib/kernel/import-session/import-session-engine.ts
import type {
  ImportSession,
  ImportSessionCompletionInput,
  ImportSessionCreateInput,
  ImportSessionDiscoveryInput,
  ImportSessionFailureInput,
  ImportSessionProgressInput,
} from "./types";

export interface ImportSessionEngine {
  create(input: ImportSessionCreateInput): Promise<ImportSession>;
  start(sessionId: string): Promise<ImportSession>;
  recordDiscovery(input: ImportSessionDiscoveryInput): Promise<ImportSession>;
  recordProgress(input: ImportSessionProgressInput): Promise<ImportSession>;
  complete(input: ImportSessionCompletionInput): Promise<ImportSession>;
  fail(input: ImportSessionFailureInput): Promise<ImportSession>;
}
