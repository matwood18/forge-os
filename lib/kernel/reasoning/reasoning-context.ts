import type { Worldview } from "../worldview";

export type ReasoningContext = {
  worldview: Worldview;
  objective?: string;
};