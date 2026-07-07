// lib/demo/session.ts
import type { ExecutionTimeline } from "./timeline";
import type { DemoPipeline } from "./types";

export type DemoSession = {
  id: string;

  createdAt: Date;

  input: string;

  pipeline: DemoPipeline;

  timeline: ExecutionTimeline;
};