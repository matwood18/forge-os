import { DemoPipelineBuilder } from "./demo-pipeline-builder";

import type { DemoSession } from "./session";

export class DemoSessionBuilder {
  private readonly pipelineBuilder = new DemoPipelineBuilder();

  build(input = ""): DemoSession {
    return {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      input,
      pipeline: this.pipelineBuilder.build(),
    };
  }
}