import type { WorldModel } from "./types";

export interface WorldModelBuilder {
  build(): Promise<WorldModel>;
}