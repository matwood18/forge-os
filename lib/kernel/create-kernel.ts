import { StructuredOpenAIModel } from "@/lib/infrastructure/ai/openai";
import { ForgeKernel } from "./forge-kernel";
import { AIReasoningEngine, BasicReasoningEngine } from "./reasoning";

export function createKernel() {
  const useAI = process.env.FORGE_USE_AI === "true";

  const reasoningEngine = useAI
    ? new AIReasoningEngine(new StructuredOpenAIModel())
    : new BasicReasoningEngine();

  return new ForgeKernel({
    reasoningEngine,
  });
}