import type { ShowcaseProjection } from "@/lib/showcase";

export type ExecutiveSession = {
  projection: ShowcaseProjection;
  createdAt: Date;
};

export interface ExecutiveSessionStore {
  replace(session: ExecutiveSession): void;
  current(): ExecutiveSession | undefined;
  clear(): void;
}
