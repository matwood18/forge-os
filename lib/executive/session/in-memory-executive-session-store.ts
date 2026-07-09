import type { ExecutiveSession, ExecutiveSessionStore } from "./types";

export class InMemoryExecutiveSessionStore implements ExecutiveSessionStore {
  private session: ExecutiveSession | undefined;

  replace(session: ExecutiveSession): void {
    this.session = session;
  }

  current(): ExecutiveSession | undefined {
    return this.session;
  }

  clear(): void {
    this.session = undefined;
  }
}

export const executiveSessionStore = new InMemoryExecutiveSessionStore();
