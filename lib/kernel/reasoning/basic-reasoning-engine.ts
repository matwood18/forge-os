import type { ArgumentGeneratorRegistry } from "./argument-generator-registry";
import type { ArgumentSynthesizer } from "./argument-synthesizer";
import type { ReasoningSessionRepository } from "./reasoning-session-repository";
import type {
  ReasoningEngine,
  ReasoningEngineInput,
  ReasoningSession,
} from "./types";

export class BasicReasoningEngine implements ReasoningEngine {
  constructor(
    private readonly argumentGeneratorRegistry: ArgumentGeneratorRegistry,
    private readonly argumentSynthesizer: ArgumentSynthesizer,
    private readonly repository: ReasoningSessionRepository
  ) {}

  async reason(input: ReasoningEngineInput): Promise<ReasoningSession> {
    const context = {
      worldview: input.worldview,
      objective: input.objective,
    };

    const candidates = await this.argumentGeneratorRegistry.generate(context);
    const arguments_ = await this.argumentSynthesizer.synthesize(candidates);

    return this.repository.save({
      worldviewId: input.worldviewId,
      objective: input.objective,
      arguments: arguments_,
    });
  }
}