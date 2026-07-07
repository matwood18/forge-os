// lib/demo/demo-data-provider.ts
import type { ForgeKernel } from "@/lib/kernel";

import { KernelDemoPipelineBuilder } from "./kernel-demo-pipeline-builder";
import { PassExecutionInspectorBuilder } from "./pass-execution";
import type { DemoSession } from "./session";
import { ExecutionTimelineBuilder } from "./timeline";

const DEFAULT_DEMO_INPUT = "Jess helped redesign the memory engine.";

/**
 * Supplies data to the Forge cognitive demo.
 *
 * Demo data is projected from a provided kernel execution so this layer stays
 * focused on presentation rather than reconstructing kernel internals.
 */
export class DemoDataProvider {
  constructor(
    private readonly kernel: ForgeKernel,
    private readonly pipelineBuilder = new KernelDemoPipelineBuilder(),
    private readonly timelineBuilder = new ExecutionTimelineBuilder(),
    private readonly passExecutionInspectorBuilder =
      new PassExecutionInspectorBuilder()
  ) {}

  async load(input = DEFAULT_DEMO_INPUT): Promise<DemoSession> {
    const execution = await this.kernel.execute(input);
    const pipeline = this.pipelineBuilder.build(execution);
    const timeline = this.timelineBuilder.build(execution);
    const passExecutionInspector =
      this.passExecutionInspectorBuilder.build(execution);

    return {
      id: execution.id,
      createdAt: execution.startedAt,
      input: execution.input,
      pipeline,
      timeline,
      passExecutionInspector,
    };
  }
}