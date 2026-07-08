// lib/kernel/import-session/in-memory-import-session-repository.ts
import type { ImportSessionRepository } from "./import-session-repository";
import type {
  ImportSession,
  ImportSessionExternalIdentity,
} from "./types";

export class InMemoryImportSessionRepository
  implements ImportSessionRepository
{
  private readonly sessions = new Map<string, ImportSession>();

  async save(session: ImportSession): Promise<ImportSession> {
    this.sessions.set(session.id, session);

    return session;
  }

  async find(id: string): Promise<ImportSession | null> {
    return this.sessions.get(id) ?? null;
  }

  async findByExternalIdentity(
    identity: ImportSessionExternalIdentity
  ): Promise<ImportSession | null> {
    return (
      [...this.sessions.values()].find(
        (session) =>
          session.externalIdentity.sourceSystem === identity.sourceSystem &&
          session.externalIdentity.externalId === identity.externalId
      ) ?? null
    );
  }

  async list(): Promise<ImportSession[]> {
    return [...this.sessions.values()];
  }
}
