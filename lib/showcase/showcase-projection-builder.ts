// lib/showcase/showcase-projection-builder.ts
import type {
  KernelExecution,
  KernelExecutionStep,
  KernelExecutionStepType,
} from "@/lib/kernel/execution";
import type { EntityMentionExtractionRecord } from "@/lib/kernel/entity-mention";

import type {
  ShowcaseProjection,
  ShowcaseStage,
  ShowcaseUnderstanding,
  ShowcaseUnderstandingItem,
} from "./types";

function countSteps(execution: KernelExecution, type: KernelExecutionStepType) {
  return execution.steps.filter((step) => step.type === type).length;
}

function hasSteps(execution: KernelExecution, type: KernelExecutionStepType) {
  return countSteps(execution, type) > 0;
}

function isEntityMentionExtractionStep(
  step: KernelExecutionStep
): step is KernelExecutionStep & {
  artifact: EntityMentionExtractionRecord;
} {
  return step.type === "entity_mention.extracted";
}

function buildMentionItems(
  execution: KernelExecution,
  kind: "person_name" | "task_or_obligation",
  summary: string
): ShowcaseUnderstandingItem[] {
  const itemsByNormalizedText = new Map<string, ShowcaseUnderstandingItem>();

  for (const step of execution.steps) {
    if (!isEntityMentionExtractionStep(step)) {
      continue;
    }

    for (const mention of step.artifact.mentions) {
      if (mention.kind !== kind) {
        continue;
      }

      const label = mention.normalizedText || mention.text;
      const key = label.toLowerCase();
      const existing = itemsByNormalizedText.get(key);

      if (!existing || mention.confidence > (existing.confidence ?? 0)) {
        itemsByNormalizedText.set(key, {
          id: mention.id,
          label,
          summary,
          confidence: mention.confidence,
        });
      }
    }
  }

  return [...itemsByNormalizedText.values()];
}

function buildUnderstanding(execution: KernelExecution): ShowcaseUnderstanding {
  return {
    people: {
      title: "People",
      summary:
        "People mentioned in the input, projected from kernel entity mention extraction.",
      items: buildMentionItems(
        execution,
        "person_name",
        "Person mention extracted by the kernel."
      ),
      emptyState:
        "No person mentions were exposed through entity mention extraction.",
    },
    obligations: {
      title: "Obligations",
      summary:
        "Tasks or obligations identified in the input by kernel entity mention extraction.",
      items: buildMentionItems(
        execution,
        "task_or_obligation",
        "Possible task or obligation extracted by the kernel."
      ),
      emptyState:
        "No task or obligation mentions were exposed through entity mention extraction.",
    },
  };
}

export function buildShowcaseProjection(
  execution: KernelExecution
): ShowcaseProjection {
  const hasInterpretation = hasSteps(
    execution,
    "semantic_interpretation.completed"
  );
  const hasGrounding = hasSteps(execution, "grounding.completed");
  const entityMentionCount = countSteps(execution, "entity_mention.extracted");
  const observationCount = countSteps(execution, "observation.available");
  const relationshipCount = countSteps(execution, "relationship.inferred");
  const memoryCount = countSteps(execution, "memory.available");
  const reasoningCount = countSteps(execution, "reasoning.completed");
  const questionCount = countSteps(execution, "question.created");

  const stages: ShowcaseStage[] = [
    {
      title: "Receiving Input",
      headline: "Forge received the messy input exactly as written.",
      summary:
        "The first step is capture: no cleanup, no judgment, no premature action.",
      bullets: [
        execution.input,
        "Source text entered the real Forge kernel.",
        "A traceable execution was created.",
      ],
      log: "Kernel recorded source input.",
    },
    {
      title: "Understanding Meaning",
      headline: hasInterpretation
        ? "Forge interpreted the situation behind the words."
        : "Forge attempted to interpret the input.",
      summary:
        "This stage turns raw text into meaning the rest of the system can reason over.",
      bullets: [
        hasInterpretation
          ? "Meaning was interpreted by the semantic layer."
          : "No semantic interpretation was recorded.",
        `${entityMentionCount} entity mention extraction step(s) recorded.`,
        "The UI is showing a projection of real kernel output.",
      ],
      log: `${countSteps(
        execution,
        "semantic_interpretation.completed"
      )} semantic interpretation step(s), ${entityMentionCount} entity mention extraction step(s).`,
    },
    {
      title: "Grounding Knowledge",
      headline: hasGrounding
        ? "Forge separated understanding from what it can safely treat as knowledge."
        : "Forge did not record grounded knowledge for this run.",
      summary:
        "Grounding protects Forge from pretending unresolved references are already known.",
      bullets: [
        hasGrounding
          ? "Grounding completed for the interpreted input."
          : "No grounding artifact was produced.",
        `${observationCount} observation(s) became available.`,
        "Knowledge boundaries remain explicit.",
      ],
      log: `${countSteps(
        execution,
        "grounding.completed"
      )} grounding step(s), ${observationCount} observation step(s).`,
    },
    {
      title: "Reasoning Runtime",
      headline:
        reasoningCount > 0
          ? "Forge ran cognition over the compiled input."
          : "Forge did not record a reasoning session.",
      summary:
        "The reasoning runtime consumes compiled knowledge and looks for useful next understanding.",
      bullets: [
        `${reasoningCount} reasoning session(s) completed.`,
        `${relationshipCount} relationship signal(s) detected.`,
        `${memoryCount} memory artifact(s) made available.`,
      ],
      log: `${reasoningCount} reasoning step(s), ${relationshipCount} relationship step(s), ${memoryCount} memory step(s).`,
    },
    {
      title: "Handling Uncertainty",
      headline:
        questionCount > 0
          ? "Forge found something unresolved."
          : "Forge did not need to ask a new question this time.",
      summary:
        "Uncertainty is preserved instead of being papered over.",
      bullets:
        questionCount > 0
          ? [
              `${questionCount} open question(s) created.`,
              "Forge marked unresolved information for later clarification.",
              "The system stopped short of guessing.",
            ]
          : [
              "No open questions were created.",
              "Forge completed this pass without requiring clarification.",
              "No unsafe assumption was introduced.",
            ],
      log: `${questionCount} question step(s) recorded.`,
    },
    {
      title: "Execution Complete",
      headline: "Forge completed real kernel execution for this showcase input.",
      summary:
        "The polished product experience is now backed by actual Forge execution data.",
      bullets: [
        `${execution.steps.length} total kernel step(s).`,
        `Started ${execution.startedAt.toLocaleString()}.`,
        `Completed ${execution.completedAt.toLocaleString()}.`,
      ],
      log: `Execution ${execution.id} completed.`,
    },
  ];

  return {
    executionId: execution.id,
    input: execution.input,
    startedAt: execution.startedAt.toISOString(),
    completedAt: execution.completedAt.toISOString(),
    totalSteps: execution.steps.length,
    stages,
    understanding: buildUnderstanding(execution),
  };
}