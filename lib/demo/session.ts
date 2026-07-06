import type { DemoPipeline } from "./types";

export type DemoSession = {
  id: string;

  createdAt: Date;

  input: string;

  pipeline: DemoPipeline;
};