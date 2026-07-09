import {
  executiveConcernCoordinator,
  executiveConcernProjector,
  executiveConcernRepository,
} from "@/lib/executive";

import {
  ForgeKernel,
} from "@/lib/kernel/forge-kernel";

import {
  buildShowcaseProjection,
} from "@/lib/showcase";

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function executeShowcase(input: string) {
  const execution = await new ForgeKernel().execute(input);
  const projection = await buildShowcaseProjection(execution);

  const concernProjection = executiveConcernProjector.project({
    attention: projection.executiveAttention,
    output: projection.executiveOutput,
  });

  const coordination = await executiveConcernCoordinator.coordinate({
    projection: concernProjection,
  });

  return {
    projection,
    concernProjection,
    coordination,
  };
}

async function main(): Promise<void> {
  process.env.OPENAI_API_KEY =
    process.env.OPENAI_API_KEY ?? "test-key-for-fallback-proof";

  await executiveConcernRepository.clear();

  const firstRun = await executeShowcase(
    "Jess is mad at me for not contacting insurance."
  );

  const concernsAfterFirstRun = await executiveConcernRepository.list();

  assert(
    firstRun.concernProjection.observations.length > 0,
    "Expected first Showcase execution to project concern observations."
  );

  assert(
    concernsAfterFirstRun.length > 0,
    "Expected first Showcase execution to persist durable concerns."
  );

  const firstConcernIds = new Set(
    concernsAfterFirstRun.map((concern) => concern.id)
  );

  const firstIdentityEvidenceIds = new Set(
    firstRun.concernProjection.observations.flatMap(
      (observation) => observation.identityEvidenceIds ?? []
    )
  );

  assert(
    firstIdentityEvidenceIds.has(
      "concern-identity:obligation:current-operator:insurance"
    ),
    "Expected first Showcase execution to preserve stable insurance identity evidence."
  );

  assert(
    concernsAfterFirstRun.some((concern) =>
      concern.supportingEvidence.some(
        (evidence) =>
          evidence.kind === "identityEvidence" &&
          evidence.sourceId ===
            "concern-identity:obligation:current-operator:insurance"
      )
    ),
    "Expected first Showcase execution to persist stable identity evidence on durable concern."
  );

  const secondRun = await executeShowcase(
    "I still have not contacted the insurance company."
  );

  const concernsAfterSecondRun = await executiveConcernRepository.list();

  const secondIdentityEvidenceIds = new Set(
    secondRun.concernProjection.observations.flatMap(
      (observation) => observation.identityEvidenceIds ?? []
    )
  );

  const sharedIdentityEvidenceIds = [...firstIdentityEvidenceIds].filter(
    (evidenceId) => secondIdentityEvidenceIds.has(evidenceId)
  );

  const resolvedIdentityRecords = secondRun.coordination.records.filter(
    (record) =>
      record.kind === "reconciled" &&
      record.identityResult?.kind === "resolved"
  );

  const ambiguousIdentityRecords = secondRun.coordination.records.filter(
    (record) => record.kind === "identity_ambiguous"
  );

  const newlyCreatedConcerns = concernsAfterSecondRun.filter(
    (concern) => !firstConcernIds.has(concern.id)
  );

  const updatedOriginalConcerns = concernsAfterSecondRun.filter((concern) =>
    firstConcernIds.has(concern.id)
  );

  assert(
    sharedIdentityEvidenceIds.includes(
      "concern-identity:obligation:current-operator:insurance"
    ),
    [
      "Expected differently worded Showcase executions to share stable semantic identity evidence.",
      `First identity evidence ids: ${JSON.stringify([...firstIdentityEvidenceIds])}`,
      `Second identity evidence ids: ${JSON.stringify([...secondIdentityEvidenceIds])}`,
    ].join("\n")
  );

  assert(
    resolvedIdentityRecords.length > 0,
    "Expected second Showcase execution to preserve resolved concern identity."
  );

  assert(
    ambiguousIdentityRecords.length === 0,
    "Expected Showcase identity convergence not to become ambiguous."
  );

  assert(
    newlyCreatedConcerns.length === 0,
    "Expected differently worded Showcase execution not to create duplicate durable concerns."
  );

  assert(
    concernsAfterSecondRun.length === concernsAfterFirstRun.length,
    "Expected durable concern count to remain stable."
  );

  assert(
    updatedOriginalConcerns.some(
      (concern) => concern.supportingEvidence.length > 1
    ),
    "Expected original durable concern to accumulate longitudinal evidence."
  );

  console.log(
    "Showcase executive concern identity longitudinal proof passed."
  );

  console.log(
    JSON.stringify(
      {
        firstExecutionConcernCount: concernsAfterFirstRun.length,
        secondExecutionConcernCount: concernsAfterSecondRun.length,
        sharedIdentityEvidenceIds,
        resolvedIdentityRecordCount: resolvedIdentityRecords.length,
        ambiguousIdentityRecordCount: ambiguousIdentityRecords.length,
        newlyCreatedConcernCount: newlyCreatedConcerns.length,
        accumulatedEvidenceOnOriginalConcern: updatedOriginalConcerns.some(
          (concern) => concern.supportingEvidence.length > 1
        ),
      },
      null,
      2
    )
  );
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await executiveConcernRepository.clear();
  });
