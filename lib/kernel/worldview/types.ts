import type { Belief } from "@/lib/kernel/belief";

export type Worldview = {
  generatedAt: Date;

  beliefs: Belief[];
};

export type WorldviewInput = {
  beliefs: Belief[];
};

export type WorldviewResult = {
  worldview: Worldview;
};