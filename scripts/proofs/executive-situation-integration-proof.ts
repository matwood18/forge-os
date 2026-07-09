import assert from "node:assert/strict";

import {
  BasicExecutionSituationEvidenceBuilder,
  BasicExecutiveSituationEngine,
  BasicExecutiveSituationProvider,
} from "@/lib/executive/situation";

async function main(): Promise<void> {
  const execution = {
    id: "execution-situation-integration-proof",
    input:
      "Jess is mad at me for not contacting insurance. Maxx asked me to help with his project again.",
    startedAt: new Date("2026-07-09T12:00:00.000Z"),
    completedAt: new Date("2026-07-09T12:00:01.000Z"),
    steps: [
      {
        id: "step-interpretation",
        type: "semantic_interpretation.completed",
        startedAt: new Date("2026-07-09T12:00:00.000Z"),
        completedAt: new Date("2026-07-09T12:00:00.100Z"),
        artifact: {
          id: "interpretation-1",
          sourceEvent: {
            id: "event-1",
            type: "manual_note.created",
            source: "proof",
            occurredAt: new Date("2026-07-09T12:00:00.000Z"),
            payload: {
              text:
                "Jess is mad at me for not contacting insurance. Maxx asked me to help with his project again.",
            },
          },
          interpretedAt: new Date("2026-07-09T12:00:00.000Z"),
          signals: [
            {
              id: "signal-relationship",
              kind: "relationship_impact",
              label: "Relationship impact",
              summary:
                "The insurance issue may be affecting Jess.",
              confidence: 0.74,
              payload: {},
            },
            {
              id: "signal-repeated",
              kind: "repeated_failure_mode",
              label: "Repeated failure mode",
              summary:
                "The input suggests a repeated request or breakdown.",
              confidence: 0.7,
              payload: {},
            },
          ],
          semanticEvents: [],
        },
      },
      {
        id: "step-mentions",
        type: "entity_mention.extracted",
        startedAt: new Date("2026-07-09T12:00:00.100Z"),
        completedAt: new Date("2026-07-09T12:00:00.200Z"),
        artifact: {
          id: "extraction-1",
          interpretationId: "interpretation-1",
          source: {
            interpretationId: "interpretation-1",
            input:
              "Jess is mad at me for not contacting insurance. Maxx asked me to help with his project again.",
          },
          mentions: [
            {
              id: "mention-jess",
              extractionId: "extraction-1",
              text: "Jess",
              normalizedText: "jess",
              kind: "person_name",
              role: "related_party",
              startOffset: 0,
              endOffset: 4,
              confidence: 0.65,
              resolutionHints: [],
            },
            {
              id: "mention-maxx",
              extractionId: "extraction-1",
              text: "Maxx",
              normalizedText: "maxx",
              kind: "person_name",
              role: "related_party",
              startOffset: 53,
              endOffset: 57,
              confidence: 0.65,
              resolutionHints: [],
            },
          ],
          extractedAt: new Date("2026-07-09T12:00:00.200Z"),
        },
      },
      {
        id: "step-claim",
        type: "semantic_claim.generated",
        startedAt: new Date("2026-07-09T12:00:00.200Z"),
        completedAt: new Date("2026-07-09T12:00:00.300Z"),
        artifact: {
          id: "claim-insurance",
          subject: "current_operator",
          predicate: "has_possible_obligation",
          object: "contacting insurance",
          confidence: 0.55,
          provenance: {
            sourceType: "entity_mention",
            sourceId: "mention-insurance",
          },
          createdAt: new Date("2026-07-09T12:00:00.300Z"),
        },
      },
    ],
    passExecutions: [],
  } as never;

  const situationInput =
    new BasicExecutionSituationEvidenceBuilder().build(execution);

  assert(
    situationInput.evidence.some(
      (evidence) => evidence.id === "mention-maxx"
    ),
    "Expected situation evidence assembly to include Maxx person evidence."
  );

  assert(
    situationInput.evidence.some(
      (evidence) => evidence.id === "claim-insurance"
    ),
    "Expected situation evidence assembly to include semantic claim evidence."
  );

  const situationResult =
    await new BasicExecutiveSituationEngine(
      new BasicExecutiveSituationProvider()
    ).interpret(situationInput);

  assert(
    situationResult.situations.length >= 3,
    "Expected deterministic situation provider to receive assembled evidence."
  );

  const negativeObligationExecution = {
    id: "execution-negative-obligation-proof",
    input: "I still have not contacted the insurance company.",
    startedAt: new Date("2026-07-09T12:01:00.000Z"),
    completedAt: new Date("2026-07-09T12:01:01.000Z"),
    steps: [
      {
        id: "step-negative-obligation-interpretation",
        type: "semantic_interpretation.completed",
        startedAt: new Date("2026-07-09T12:01:00.000Z"),
        completedAt: new Date("2026-07-09T12:01:00.100Z"),
        artifact: {
          id: "interpretation-negative-obligation",
          sourceEvent: {
            id: "event-negative-obligation",
            type: "manual_note.created",
            source: "proof",
            occurredAt: new Date("2026-07-09T12:01:00.000Z"),
            payload: {
              text: "I still have not contacted the insurance company.",
            },
          },
          interpretedAt: new Date("2026-07-09T12:01:00.000Z"),
          signals: [
            {
              id: "signal-negative-obligation",
              kind: "unresolved_obligation",
              label: "Unresolved obligation",
              summary:
                "The input appears to describe an unfinished obligation.",
              confidence: 0.76,
              payload: {
                text:
                  "I still have not contacted the insurance company.",
              },
            },
          ],
          semanticEvents: [],
        },
      },
      {
        id: "step-negative-obligation-mentions",
        type: "entity_mention.extracted",
        startedAt: new Date("2026-07-09T12:01:00.100Z"),
        completedAt: new Date("2026-07-09T12:01:00.200Z"),
        artifact: {
          id: "extraction-negative-obligation",
          interpretationId: "interpretation-negative-obligation",
          source: {
            interpretationId: "interpretation-negative-obligation",
            input:
              "I still have not contacted the insurance company.",
          },
          mentions: [
            {
              id: "mention-current-operator-negative-obligation",
              extractionId: "extraction-negative-obligation",
              text: "I",
              normalizedText: "i",
              kind: "current_operator",
              role: "actor",
              startOffset: 0,
              endOffset: 1,
              confidence: 0.95,
              resolutionHints: [],
            },
            {
              id: "mention-contacted-insurance",
              extractionId: "extraction-negative-obligation",
              text: "contacted insurance",
              normalizedText: "contacted insurance",
              kind: "task_or_obligation",
              role: "object",
              startOffset: 17,
              endOffset: 36,
              confidence: 0.55,
              resolutionHints: [],
            },
          ],
          extractedAt: new Date("2026-07-09T12:01:00.200Z"),
        },
      },
      {
        id: "step-negative-obligation-claim",
        type: "semantic_claim.generated",
        startedAt: new Date("2026-07-09T12:01:00.200Z"),
        completedAt: new Date("2026-07-09T12:01:00.300Z"),
        artifact: {
          id: "claim-negative-insurance",
          subject: "current_operator",
          predicate: "has_possible_obligation",
          object: "contacted insurance",
          confidence: 0.55,
          provenance: {
            sourceType: "entity_mention",
            sourceId: "mention-contacted-insurance",
          },
          createdAt: new Date("2026-07-09T12:01:00.300Z"),
        },
      },
    ],
    passExecutions: [],
  } as never;

  const negativeObligationSituationInput =
    new BasicExecutionSituationEvidenceBuilder().build(
      negativeObligationExecution
    );

  assert(
    negativeObligationSituationInput.evidence.some(
      (evidence) => evidence.id === "claim-negative-insurance"
    ),
    "Expected negative obligation wording to reach executive situation evidence."
  );

  console.log("Executive situation integration proof passed.");
  console.log(
    JSON.stringify(
      {
        evidenceCount: situationInput.evidence.length,
        includesMaxxEvidence:
          situationInput.evidence.some(
            (evidence) => evidence.id === "mention-maxx"
          ),
        includesSemanticClaimEvidence:
          situationInput.evidence.some(
            (evidence) => evidence.id === "claim-insurance"
          ),
        deterministicSituationCount:
          situationResult.situations.length,
        negativeObligationEvidencePreserved:
          negativeObligationSituationInput.evidence.some(
            (evidence) => evidence.id === "claim-negative-insurance"
          ),
      },
      null,
      2
    )
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
