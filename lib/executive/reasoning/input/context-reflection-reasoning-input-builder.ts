import type {
  ContextReflectionInput,
  PersonalContextReflection,
} from "@/lib/executive/context-reflection";

import type {
  ExecutiveReasoningEvidence,
  ExecutiveReasoningInput,
} from "../types";

export type ContextReflectionReasoningInputBuilderInput = {
  sourceText: string;
  reflection: PersonalContextReflection;
  contextInput: ContextReflectionInput;
};

export interface ContextReflectionReasoningInputBuilder {
  build(
    input: ContextReflectionReasoningInputBuilderInput
  ): ExecutiveReasoningInput;
}

export class BasicContextReflectionReasoningInputBuilder
  implements ContextReflectionReasoningInputBuilder
{
  build(
    input: ContextReflectionReasoningInputBuilderInput
  ): ExecutiveReasoningInput {
    const evidence: ExecutiveReasoningEvidence[] =
      input.contextInput.signals.map((signal, index) => ({
        id: `${input.reflection.id}:signal:${index}`,
        label: signal.label,
        summary: `Signal detected during context reflection: ${signal.label}.`,
        confidence: signal.confidence,
        source: input.reflection.evidence.sourceEventId,
      }));

    evidence.push({
      id: `${input.reflection.id}:reflection`,
      label: `Context reflection importance: ${input.reflection.importance}`,
      summary: input.reflection.summary,
      confidence: input.reflection.confidence,
      source: input.reflection.evidence.sourceEventId,
    });

    return {
      input: input.sourceText,
      evidence,
    };
  }
}
