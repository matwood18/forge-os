import { ForgeKernel } from "@/lib/kernel/forge-kernel";
import { buildShowcaseProjection } from "@/lib/showcase";

async function main(): Promise<void> {
  process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "test-key-for-fallback-proof";
  const kernel = new ForgeKernel();

  const execution = await kernel.execute(
    [
      "Jess is mad at me for not contacting insurance.",
      "I need to call the dentist before Friday.",
      "Maxx asked me to help with his project again.",
    ].join("\n")
  );

  const projection = await buildShowcaseProjection(execution);

  const proof = {
    suggestionsExposed:
      projection.executiveOutput.suggestions.length > 0,
    suggestionSummaryMatches:
      projection.executiveOutput.summary.suggestionCount ===
      projection.executiveOutput.suggestions.length,
    suggestionsRemainPending:
      projection.executiveOutput.suggestions.every(
        (suggestion) => suggestion.status === "pending"
      ),
    suggestionsPreserveEvidence:
      projection.executiveOutput.suggestions.every(
        (suggestion) => suggestion.evidence.length > 0
      ),
    clarificationsIntentionallyEmpty:
      projection.executiveOutput.clarifications.length === 0 &&
      projection.executiveOutput.summary.clarificationCount === 0 &&
      projection.executiveOutput.summary.hasPendingClarifications === false,
    executiveBriefStillPresent:
      projection.executiveBrief.priorities.length > 0,
    noTaskOrAuthorizationLeak:
      !Object.prototype.hasOwnProperty.call(
        projection.executiveOutput,
        "tasks"
      ) &&
      !Object.prototype.hasOwnProperty.call(
        projection.executiveOutput,
        "authorizations"
      ),
  };

  const passed = Object.values(proof).every(Boolean);

  if (!passed) {
    console.error(
      "Showcase executive output integration proof failed."
    );
    console.error(JSON.stringify(proof, null, 2));
    process.exit(1);
  }

  console.log(
    "Showcase executive output integration proof passed."
  );
  console.log(JSON.stringify(proof, null, 2));
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
