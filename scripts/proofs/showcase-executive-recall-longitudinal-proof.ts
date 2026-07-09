import {
  executiveConcernCoordinator,
  executiveConcernProjector,
  executiveConcernRepository,
} from "@/lib/executive";
import { ForgeKernel } from "@/lib/kernel/forge-kernel";
import { buildShowcaseProjection } from "@/lib/showcase";

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

  await executiveConcernCoordinator.coordinate({
    projection: concernProjection,
  });

  return projection;
}

async function main(): Promise<void> {
  process.env.OPENAI_API_KEY =
    process.env.OPENAI_API_KEY ?? "test-key-for-fallback-proof";

  await executiveConcernRepository.clear();

  const firstProjection = await executeShowcase(
    "Jess is mad at me for not contacting insurance."
  );

  assert(
    firstProjection.executiveOutput.suggestions.length > 0,
    "Expected first execution to produce executive suggestions."
  );

  const concernsAfterFirstExecution = await executiveConcernRepository.list();

  assert(
    concernsAfterFirstExecution.length > 0,
    "Expected first execution route-equivalent flow to persist durable executive concerns."
  );

  const secondProjection = await executeShowcase(
    "I need to decide what matters today."
  );

  const recalledConcernTitles = new Set(
    concernsAfterFirstExecution.map((concern) => concern.title)
  );

  const recalledConcernBriefTitle =
    secondProjection.executiveBrief.priorities
      .map((priority) => priority.title)
      .find((title) => recalledConcernTitles.has(title));

  const secondSuggestionEvidenceIds =
    secondProjection.executiveOutput.suggestions.flatMap((suggestion) =>
      suggestion.evidence.map((evidence) => evidence.id)
    );

  const recalledConcernOutputEvidenceId = concernsAfterFirstExecution
    .map((concern) => `${concern.id}:recall`)
    .find((evidenceId) => secondSuggestionEvidenceIds.includes(evidenceId));

  assert(
    recalledConcernBriefTitle !== undefined,
    "Expected second execution brief to surface a recalled concern."
  );

  assert(
    recalledConcernOutputEvidenceId !== undefined,
    "Expected second execution output to preserve recalled concern provenance."
  );

  assert(
    !secondProjection.input.includes("insurance"),
    "Expected second input not to mention the original concern directly."
  );

  const concernsAfterSecondExecution = await executiveConcernRepository.list();

  assert(
    concernsAfterSecondExecution.length >= concernsAfterFirstExecution.length,
    "Expected second execution not to erase durable executive concerns."
  );

  console.log("Showcase executive recall longitudinal proof passed.");
  console.log(
    JSON.stringify(
      {
        firstExecutionConcernCount: concernsAfterFirstExecution.length,
        secondExecutionConcernCount: concernsAfterSecondExecution.length,
        recalledConcernBriefTitle,
        recalledConcernOutputEvidenceId,
        secondInputContainedOriginalConcern: secondProjection.input.includes(
          "insurance"
        ),
        longitudinalRecallVisibleInBrief: true,
        longitudinalRecallVisibleInOutput: true,
      },
      null,
      2
    )
  );
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await executiveConcernRepository.clear();
  });
