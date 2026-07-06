import type { ReasoningSessionRepository } from "./reasoning-session-repository";
import type { ReasoningSession, ReasoningSessionCreateInput } from "./types";

export class InMemoryReasoningSessionRepository
  implements ReasoningSessionRepository
{
  private readonly sessions: ReasoningSession[] = [];

  async save(session: ReasoningSessionCreateInput): Promise<ReasoningSession> {
    const savedSession: ReasoningSession = {
      ...session,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    this.sessions.push(savedSession);

    return savedSession;
  }

  async get(id: string): Promise<ReasoningSession | null> {
    return this.sessions.find((session) => session.id === id) ?? null;
  }

  async forWorldview(worldviewId: string): Promise<ReasoningSession[]> {
    return this.sessions.filter(
      (session) => session.worldviewId === worldviewId
    );
  }

  async all(): Promise<ReasoningSession[]> {
    return [...this.sessions];
  }
}