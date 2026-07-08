// lib/kernel/import-session/basic-import-session-engine.ts
import type { ImportSessionRepository } from "./import-session-repository";
import type { ImportSessionEngine } from "./import-session-engine";
import type {
  ImportSession,
  ImportSessionCompletionInput,
  ImportSessionCreateInput,
  ImportSessionProgressInput,
} from "./types";

export class BasicImportSessionEngine implements ImportSessionEngine {
  constructor(private readonly repository: ImportSessionRepository) {}

  async create(input: ImportSessionCreateInput): Promise<ImportSession> {
    const existingSession = await this.repository.findByExternalIdentity(
      input.externalIdentity
    );

    if (existingSession) {
      return existingSession;
    }

    const createdAt = input.createdAt ?? new Date();

    return this.repository.save({
      id: input.id,
      externalIdentity: input.externalIdentity,
      status: "pending",
      counts: {
        discovered: input.discovered,
        processed: 0,
        succeeded: 0,
        failed: 0,
      },
      startedAt: null,
      completedAt: null,
      createdAt,
      updatedAt: createdAt,
    });
  }

  async start(sessionId: string): Promise<ImportSession> {
    const session = await this.requireSession(sessionId);
    const now = new Date();

    return this.repository.save({
      ...session,
      status: "running",
      startedAt: session.startedAt ?? now,
      completedAt: null,
      updatedAt: now,
    });
  }

  async recordProgress(
    input: ImportSessionProgressInput
  ): Promise<ImportSession> {
    const session = await this.requireSession(input.sessionId);

    return this.repository.save({
      ...session,
      status: "running",
      counts: {
        discovered: session.counts.discovered,
        processed: session.counts.processed + input.processed,
        succeeded: session.counts.succeeded + input.succeeded,
        failed: session.counts.failed + input.failed,
      },
      updatedAt: new Date(),
    });
  }

  async complete(input: ImportSessionCompletionInput): Promise<ImportSession> {
    const session = await this.requireSession(input.sessionId);
    const completedAt = input.completedAt ?? new Date();

    return this.repository.save({
      ...session,
      status:
        session.counts.failed > 0 ? "completed_with_failures" : "completed",
      completedAt,
      updatedAt: completedAt,
    });
  }

  private async requireSession(sessionId: string): Promise<ImportSession> {
    const session = await this.repository.find(sessionId);

    if (!session) {
      throw new Error(`Import session not found: ${sessionId}`);
    }

    return session;
  }
}
