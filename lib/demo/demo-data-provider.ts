// lib/demo/demo-data-provider.ts
import type { ForgeKernel } from "@/lib/kernel";

import { ActionInspectorBuilder } from "./action";
import { AuthorizationDecisionInspectorBuilder } from "./authorization";
import { KernelDemoPipelineBuilder } from "./kernel-demo-pipeline-builder";
import { PassExecutionInspectorBuilder } from "./pass-execution";
import { RecommendationInspectorBuilder } from "./recommendation";
import { ReflectionInspectorBuilder } from "./reflection";
import { RunSummaryBuilder } from "./run-summary";
import type { DemoScenario } from "./scenario";
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
      new PassExecutionInspectorBuilder(),
    private readonly reflectionInspectorBuilder =
      new ReflectionInspectorBuilder(),
    private readonly recommendationInspectorBuilder =
      new RecommendationInspectorBuilder(),
    private readonly authorizationDecisionInspectorBuilder =
      new AuthorizationDecisionInspectorBuilder(),
    private readonly actionInspectorBuilder = new ActionInspectorBuilder(),
    private readonly runSummaryBuilder = new RunSummaryBuilder()
  ) {}

  async load(input = DEFAULT_DEMO_INPUT): Promise<DemoSession> {
    return this.loadInput(input);
  }

  async loadScenario(scenario: DemoScenario): Promise<DemoSession> {
    return this.loadInput(scenario.input);
  }

  private async loadInput(input: string): Promise<DemoSession> {
    const execution = await this.kernel.execute(input);
    const reflections = await this.kernel.reflections();
    const recommendations = await this.kernel.recommendations();
    const authorizationDecisions =
      await this.kernel.authorizationDecisions();
    const actions = await this.kernel.actions();

    const pipeline = this.pipelineBuilder.build(execution);
    const timeline = this.timelineBuilder.build(execution);
    const passExecutionInspector =
      this.passExecutionInspectorBuilder.build(execution);
    const reflectionInspector =
      this.reflectionInspectorBuilder.build(execution, reflections);
    const recommendationInspector =
      this.recommendationInspectorBuilder.build(
        execution,
        recommendations
      );
    const authorizationDecisionInspector =
      this.authorizationDecisionInspectorBuilder.build(
        execution,
        authorizationDecisions
      );
    const actionInspector =
      this.actionInspectorBuilder.build(execution, actions);

    const sessionWithoutRunSummary: Omit<DemoSession, "runSummary"> = {
      id: execution.id,
      createdAt: execution.startedAt,
      input: execution.input,
      pipeline,
      timeline,
      passExecutionInspector,
      reflectionInspector,
      recommendationInspector,
      authorizationDecisionInspector,
      actionInspector,
    };

    const runSummary =
      this.runSummaryBuilder.build(sessionWithoutRunSummary);

    return {
      ...sessionWithoutRunSummary,
      runSummary,
    };
  }
}