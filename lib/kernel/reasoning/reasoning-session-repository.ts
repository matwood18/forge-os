import type { ReasoningSession, ReasoningSessionCreateInput } from "./types";

export interface ReasoningSessionRepository {
  save(session: ReasoningSessionCreateInput): Promise<ReasoningSession>;

  get(id: string): Promise<ReasoningSession | null>;

  forWorldview(worldviewId: string): Promise<ReasoningSession[]>;

  all(): Promise<ReasoningSession[]>;
}