// lib/showcase/showcase-projection-builder.ts
import type { EntityMentionExtractionRecord } from "@/lib/kernel/entity-mention";
import type {
  KernelExecution,
  KernelExecutionStep,
  KernelExecutionStepType,
} from "@/lib/kernel/execution";
import type { SemanticClaim } from "@/lib/kernel/semantic-claim";
import type { SemanticClaimRelation } from "@/lib/kernel/semantic-claim-relation";
import type { InterpretationRecord } from "@/lib/kernel/interpretation";

import { buildShowcaseNarrative } from "./narrative";
import {
  BasicContextReflectionEngine,
  BasicContextReflectionReasoningInputBuilder,
  BasicExecutionSituationEvidenceBuilder,
  BasicExecutiveBriefBuilder,
  BasicExecutiveOutputProjector,
  BasicExecutivePresentationProjector,
  BasicExecutiveReasoningEngine,
  BasicExecutiveReasoningProvider,
  BasicExecutiveSituationEngine,
  BasicSuggestionProjector,
  BasicExecutiveSituationProvider,
  FallbackExecutiveReasoningProvider,
  FallbackExecutiveSituationProvider,
  OpenAIExecutiveReasoningProvider,
  OpenAIExecutiveSituationProvider,
} from "@/lib/executive";
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

function isSemanticClaimStep(
  step: KernelExecutionStep
): step is KernelExecutionStep & {
  artifact: SemanticClaim;
} {
  return step.type === "semantic_claim.generated";
}

function isSemanticClaimRelationStep(
  step: KernelExecutionStep
): step is KernelExecutionStep & {
  artifact: SemanticClaimRelation;
} {
  return step.type === "semantic_claim_relation.generated";
}

function isInterpretationStep(
  step: KernelExecutionStep
): step is KernelExecutionStep & {
  artifact: InterpretationRecord;
} {
  return step.type === "semantic_interpretation.completed";
}

function semanticClaimsById(
  execution: KernelExecution
): Map<string, SemanticClaim> {
  const claims = new Map<string, SemanticClaim>();

  for (const step of execution.steps) {
    if (isSemanticClaimStep(step)) {
      claims.set(step.artifact.id, step.artifact);
    }
  }

  return claims;
}

function describeClaim(claim: SemanticClaim): string {
  if (claim.predicate === "expresses_possible_emotion") {
    return `${claim.subject}: ${claim.object}`;
  }

  if (claim.predicate === "has_possible_obligation") {
    return claim.object;
  }

  return `${claim.subject} ${claim.predicate} ${claim.object}`;
}

function buildPersonItems(
  execution: KernelExecution
): ShowcaseUnderstandingItem[] {
  const itemsByNormalizedText = new Map<string, ShowcaseUnderstandingItem>();

  for (const step of execution.steps) {
    if (!isEntityMentionExtractionStep(step)) {
      continue;
    }

    for (const mention of step.artifact.mentions) {
      if (mention.kind !== "person_name") {
        continue;
      }

      const label = mention.normalizedText || mention.text;
      const key = label.toLowerCase();
      const existing = itemsByNormalizedText.get(key);

      if (!existing || mention.confidence > (existing.confidence ?? 0)) {
        itemsByNormalizedText.set(key, {
          id: mention.id,
          label,
          summary: "Person mention extracted by the kernel.",
          confidence: mention.confidence,
        });
      }
    }
  }

  return [...itemsByNormalizedText.values()];
}

function buildObligationItems(
  execution: KernelExecution
): ShowcaseUnderstandingItem[] {
  const itemsByObject = new Map<string, ShowcaseUnderstandingItem>();

  for (const step of execution.steps) {
    if (!isSemanticClaimStep(step)) {
      continue;
    }

    const claim = step.artifact;

    if (
      claim.subject !== "current_operator" ||
      claim.predicate !== "has_possible_obligation"
    ) {
      continue;
    }

    const label = claim.object;
    const key = label.toLowerCase();
    const existing = itemsByObject.get(key);

    if (!existing || claim.confidence > (existing.confidence ?? 0)) {
      itemsByObject.set(key, {
        id: claim.id,
        label,
        summary: "Possible obligation asserted by the kernel semantic layer.",
        confidence: claim.confidence,
      });
    }
  }

  return [...itemsByObject.values()];
}

function buildEmotionItems(
  execution: KernelExecution
): ShowcaseUnderstandingItem[] {
  const itemsByClaim = new Map<string, ShowcaseUnderstandingItem>();

  for (const step of execution.steps) {
    if (!isSemanticClaimStep(step)) {
      continue;
    }

    const claim = step.artifact;

    if (claim.predicate !== "expresses_possible_emotion") {
      continue;
    }

    const label = describeClaim(claim);
    const key = `${claim.subject.toLowerCase()}:${claim.object.toLowerCase()}`;
    const existing = itemsByClaim.get(key);

    if (!existing || claim.confidence > (existing.confidence ?? 0)) {
      itemsByClaim.set(key, {
        id: claim.id,
        label,
        summary:
          "Possible emotion associated with a nearby subject by the kernel semantic layer.",
        confidence: claim.confidence,
      });
    }
  }

  return [...itemsByClaim.values()];
}

function buildPossibleRelationItems(
  execution: KernelExecution
): ShowcaseUnderstandingItem[] {
  const claimsById = semanticClaimsById(execution);
  const itemsByRelation = new Map<string, ShowcaseUnderstandingItem>();

  for (const step of execution.steps) {
    if (!isSemanticClaimRelationStep(step)) {
      continue;
    }

    const relation = step.artifact;

    if (relation.kind !== "may_be_related_to") {
      continue;
    }

    const fromClaim = claimsById.get(relation.fromClaimId);
    const toClaim = claimsById.get(relation.toClaimId);

    if (!fromClaim || !toClaim) {
      continue;
    }

    const label = `${describeClaim(fromClaim)} → may be related to → ${describeClaim(toClaim)}`;
    const key = `${relation.fromClaimId}:${relation.kind}:${relation.toClaimId}`;
    const existing = itemsByRelation.get(key);

    if (!existing || relation.confidence > (existing.confidence ?? 0)) {
      itemsByRelation.set(key, {
        id: relation.id,
        label,
        summary:
          "Possible relationship between semantic claims asserted by the kernel relation layer. This does not assert causality.",
        confidence: relation.confidence,
      });
    }
  }

  return [...itemsByRelation.values()];
}

function buildUnderstanding(execution: KernelExecution): ShowcaseUnderstanding {
  return {
    people: {
      title: "People",
      summary:
        "People mentioned in the input, projected from kernel entity mention extraction.",
      items: buildPersonItems(execution),
      emptyState:
        "No person mentions were exposed through entity mention extraction.",
    },
    obligations: {
      title: "Obligations",
      summary:
        "Possible obligations projected from kernel-owned semantic claims.",
      items: buildObligationItems(execution),
      emptyState:
        "No possible obligation claims were exposed through semantic claim generation.",
    },
    emotions: {
      title: "Emotions",
      summary:
        "Possible subject-associated emotions projected from kernel-owned semantic claims.",
      items: buildEmotionItems(execution),
      emptyState:
        "No subject-associated emotion claims were exposed through semantic claim generation.",
    },
    possibleRelations: {
      title: "Possible Relations",
      summary:
        "Possible relationships projected from kernel-owned semantic claim relations.",
      items: buildPossibleRelationItems(execution),
      emptyState:
        "No possible semantic claim relations were exposed through relation generation.",
    },
  };
}

export async function buildShowcaseProjection(
  execution: KernelExecution
): Promise<ShowcaseProjection> {
  const hasInterpretation = hasSteps(
    execution,
    "semantic_interpretation.completed"
  );
  const hasGrounding = hasSteps(execution, "grounding.completed");
  const entityMentionCount = countSteps(execution, "entity_mention.extracted");
  const semanticClaimCount = countSteps(execution, "semantic_claim.generated");
  const semanticClaimRelationCount = countSteps(
    execution,
    "semantic_claim_relation.generated"
  );
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
        `${semanticClaimCount} semantic claim(s) and ${semanticClaimRelationCount} semantic claim relation(s) generated.`,
      ],
      log: `${countSteps(
        execution,
        "semantic_interpretation.completed"
      )} semantic interpretation step(s), ${entityMentionCount} entity mention extraction step(s), ${semanticClaimCount} semantic claim step(s), ${semanticClaimRelationCount} semantic claim relation step(s).`,
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

  const understanding = buildUnderstanding(execution);

  const interpretationRecords = execution.steps
    .filter(isInterpretationStep)
    .map((step) => step.artifact);

  const signals = interpretationRecords.flatMap(
    (record) => record.signals
  );

  const contextInput = {
    eventId:
      interpretationRecords[0]?.sourceEvent.id ??
      execution.id,
    signals: signals.map((signal) => ({
      kind: signal.kind,
      label: signal.label,
      summary: signal.summary,
      confidence: signal.confidence,
      payload: signal.payload,
    })),
  };

  const reflection = await new BasicContextReflectionEngine().reflect(
    contextInput
  );

  const baseReasoningInput =
    new BasicContextReflectionReasoningInputBuilder().build({
      sourceText: execution.input,
      reflection,
      contextInput,
    });

  const situationInput =
    new BasicExecutionSituationEvidenceBuilder().build(execution);

  const situationResult =
    await new BasicExecutiveSituationEngine(
      new FallbackExecutiveSituationProvider(
        new OpenAIExecutiveSituationProvider(),
        new BasicExecutiveSituationProvider()
      )
    ).interpret(situationInput);

  const situationEvidence = situationResult.situations.map(
    (situation) => ({
      id: situation.id,
      label: `Executive situation: ${situation.title}`,
      summary: situation.summary,
      confidence: situation.confidence,
      source: execution.id,
    })
  );

  const reasoningInput = {
    input: baseReasoningInput.input,
    evidence: [
      ...baseReasoningInput.evidence,
      ...situationEvidence,
    ],
  };

  const initialReasoning = await new BasicExecutiveReasoningEngine(
    new FallbackExecutiveReasoningProvider(
      new OpenAIExecutiveReasoningProvider(),
      new BasicExecutiveReasoningProvider()
    )
  ).reason(reasoningInput);

  const referencedEvidenceIds = new Set(
    initialReasoning.priorities.flatMap(
      (priority) => priority.evidenceIds
    )
  );

  const missingSituationPriorities = situationResult.situations
    .filter((situation) => !referencedEvidenceIds.has(situation.id))
    .map((situation) => ({
      title: situation.title,
      rationale:
        situation.summary,
      suggestedNextStep:
        "Review this situation and decide whether it needs attention today.",
      evidenceIds: [situation.id],
      confidence: situation.confidence,
    }));

  const reasoning = {
    ...initialReasoning,
    priorities: [
      ...initialReasoning.priorities,
      ...missingSituationPriorities,
    ],
  };

  const executiveBrief =
    new BasicExecutiveBriefBuilder().build({
      reasoningInput,
      reasoningResult: reasoning,
    });

  const rawSuggestions =
    new BasicSuggestionProjector().project({
      reasoningInput,
      reasoningResult: reasoning,
    });

  const suggestions =
    new BasicExecutivePresentationProjector().project({
      suggestions: rawSuggestions,
    });

  const executiveOutput =
    new BasicExecutiveOutputProjector().project({
      suggestions,
      clarifications: [],
      generatedAt: reasoning.generatedAt,
    });

  const projection: ShowcaseProjection = {
    executionId: execution.id,
    input: execution.input,
    startedAt: execution.startedAt.toISOString(),
    completedAt: execution.completedAt.toISOString(),
    totalSteps: execution.steps.length,
    stages,
    understanding,
    executiveBrief,
    executiveOutput,
    narrative: undefined as never,
  };

  return {
    ...projection,
    executiveBrief,
    narrative: buildShowcaseNarrative(projection),
  };
}