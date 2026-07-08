// lib/kernel/import-session/basic-import-session-engine.ts
import type { ImportSessionRepository } from "./import-session-repository";
import type { ImportSessionEngine } from "./import-session-engine";
import type {
  ImportSession,
  ImportSessionCompletionInput,
  ImportSessionCreateInput,
  ImportSessionDiscoveryInput,
  ImportSessionFailureInput,
  ImportSessionProgressInput,
} from "./types";

export class BasicImportSessionEngine implements ImportSessionEngine {
  constructor(private readonly repository: ImportSessionRepository) {}

  async create(input: ImportSessionCreateInput): Promise<ImportSession> {
    this.assertNonNegative(input.discovered, "Discovered count");

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

    if (session.status === "running") {
      return session;
    }

    this.assertMutable(session);

    const now = new Date();

    return this.repository.save({
      ...session,
      status: "running",
      startedAt: session.startedAt ?? now,
      completedAt: null,
      updatedAt: now,
    });
  }

  async recordDiscovery(
    input: ImportSessionDiscoveryInput
  ): Promise<ImportSession> {
    this.assertNonNegative(input.discovered, "Discovered count");

    const session = await this.requireRunningSession(input.sessionId);

    return this.repository.save({
      ...session,
      counts: {
        ...session.counts,
        discovered: session.counts.discovered + input.discovered,
      },
      updatedAt: new Date(),
    });
  }

  async recordProgress(
    input: ImportSessionProgressInput
  ): Promise<ImportSession> {
    this.assertNonNegative(input.processed, "Processed count");
    this.assertNonNegative(input.succeeded, "Succeeded count");
    this.assertNonNegative(input.failed, "Failed count");

    if (input.succeeded + input.failed !== input.processed) {
      throw new Error(
        "Import session progress must satisfy succeeded + failed = processed."
      );
    }

    const session = await this.requireRunningSession(input.sessionId);

    const nextProcessed = session.counts.processed + input.processed;
    const nextSucceeded = session.counts.succeeded + input.succeeded;
    const nextFailed = session.counts.failed + input.failed;

    if (nextProcessed > session.counts.discovered) {
      throw new Error(
        "Import session processed count cannot exceed discovered count."
      );
    }

    return this.repository.save({
      ...session,
      counts: {
        discovered: session.counts.discovered,
        processed: nextProcessed,
        succeeded: nextSucceeded,
        failed: nextFailed,
      },
      updatedAt: new Date(),
    });
  }

  async complete(input: ImportSessionCompletionInput): Promise<ImportSession> {
    const session = await this.requireRunningSession(input.sessionId);

    if (session.counts.processed !== session.counts.discovered) {
      throw new Error(
        "Import session cannot complete before all discovered records are processed."
      );
    }

    const completedAt = input.completedAt ?? new Date();

    return this.repository.save({
      ...session,
      status:
        session.counts.failed > 0 ? "completed_with_failures" : "completed",
      completedAt,
      updatedAt: completedAt,
    });
  }

  async fail(input: ImportSessionFailureInput): Promise<ImportSession> {
    const session = await this.requireSession(input.sessionId);

    this.assertMutable(session);

    const failedAt = input.failedAt ?? new Date();

    return this.repository.save({
      ...session,
      status: "failed",
      completedAt: failedAt,
      updatedAt: failedAt,
    });
  }

  private async requireSession(sessionId: string): Promise<ImportSession> {
    const session = await this.repository.find(sessionId);

    if (!session) {
      throw new Error(`Import session not found: ${sessionId}`);
    }

    return session;
  }

  private async requireRunningSession(
    sessionId: string
  ): Promise<ImportSession> {
    const session = await this.requireSession(sessionId);

    if (session.status !== "running") {
      throw new Error(`Import session is not running: ${sessionId}`);
    }

    return session;
  }

  private assertMutable(session: ImportSession): void {
    if (
      session.status === "completed" ||
      session.status === "completed_with_failures" ||
      session.status === "failed"
    ) {
      throw new Error(
        `Import session is terminal and cannot be mutated: ${session.id}`
      );
    }
  }

  private assertNonNegative(value: number, name: string): void {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error(`${name} must be a non-negative integer.`);
    }
  }
}
