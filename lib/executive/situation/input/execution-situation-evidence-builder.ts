import type { EntityMentionExtractionRecord } from "@/lib/kernel/entity-mention";
import type { KernelExecution, KernelExecutionStep } from "@/lib/kernel/execution";
import type { InterpretationRecord } from "@/lib/kernel/interpretation";
import type { SemanticClaim } from "@/lib/kernel/semantic-claim";
import type { SemanticClaimRelation } from "@/lib/kernel/semantic-claim-relation";

import type {
  ExecutiveSituationEvidence,
  ExecutiveSituationInput,
} from "../types";

export interface ExecutionSituationEvidenceBuilder {
  build(execution: KernelExecution): ExecutiveSituationInput;
}

function isInterpretationStep(
  step: KernelExecutionStep
): step is KernelExecutionStep & {
  artifact: InterpretationRecord;
} {
  return step.type === "semantic_interpretation.completed";
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

function describeClaim(claim: SemanticClaim): string {
  if (claim.predicate === "expresses_possible_emotion") {
    return `${claim.subject} may be expressing ${claim.object}.`;
  }

  if (claim.predicate === "has_possible_obligation") {
    return `The current operator may have an obligation: ${claim.object}.`;
  }

  return `${claim.subject} ${claim.predicate} ${claim.object}.`;
}

function describeRelation(
  relation: SemanticClaimRelation,
  claimsById: Map<string, SemanticClaim>
): string {
  const fromClaim = claimsById.get(relation.fromClaimId);
  const toClaim = claimsById.get(relation.toClaimId);

  if (!fromClaim || !toClaim) {
    return "Two semantic claims may be related.";
  }

  return `Possible relation: ${describeClaim(fromClaim)} ${describeClaim(toClaim)}`;
}

export class BasicExecutionSituationEvidenceBuilder
  implements ExecutionSituationEvidenceBuilder
{
  build(execution: KernelExecution): ExecutiveSituationInput {
    const evidence: ExecutiveSituationEvidence[] = [];
    const claimsById = new Map<string, SemanticClaim>();

    for (const step of execution.steps) {
      if (isSemanticClaimStep(step)) {
        claimsById.set(step.artifact.id, step.artifact);
      }
    }

    for (const step of execution.steps) {
      if (isInterpretationStep(step)) {
        for (const signal of step.artifact.signals) {
          evidence.push({
            id: signal.id,
            label: signal.label,
            summary: signal.summary,
            confidence: signal.confidence,
            source: step.artifact.sourceEvent.id,
          });
        }
      }

      if (isEntityMentionExtractionStep(step)) {
        for (const mention of step.artifact.mentions) {
          if (
            mention.kind !== "person_name" &&
            mention.kind !== "task_or_obligation" &&
            mention.kind !== "emotion_expression"
          ) {
            continue;
          }

          evidence.push({
            id: mention.id,
            label: `Entity mention: ${mention.kind}`,
            summary: `Forge identified "${mention.normalizedText}" as ${mention.kind}.`,
            confidence: mention.confidence,
            source: step.artifact.source.interpretationId,
          });
        }
      }

      if (isSemanticClaimStep(step)) {
        evidence.push({
          id: step.artifact.id,
          label: `Semantic claim: ${step.artifact.predicate}`,
          summary: describeClaim(step.artifact),
          confidence: step.artifact.confidence,
          source: step.artifact.provenance.sourceId,
        });
      }

      if (isSemanticClaimRelationStep(step)) {
        evidence.push({
          id: step.artifact.id,
          label: `Semantic claim relation: ${step.artifact.kind}`,
          summary: describeRelation(step.artifact, claimsById),
          confidence: step.artifact.confidence,
          source: step.artifact.provenance.sourceId,
        });
      }
    }

    return {
      sourceText: execution.input,
      evidence,
    };
  }
}
