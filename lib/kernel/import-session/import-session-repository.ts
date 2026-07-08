// lib/kernel/import-session/import-session-repository.ts
import type {
  ImportSession,
  ImportSessionExternalIdentity,
} from "./types";

export interface ImportSessionRepository {
  save(session: ImportSession): Promise<ImportSession>;
  find(id: string): Promise<ImportSession | null>;
  findByExternalIdentity(
    identity: ImportSessionExternalIdentity
  ): Promise<ImportSession | null>;
  list(): Promise<ImportSession[]>;
}
