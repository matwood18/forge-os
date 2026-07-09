import { ForgeKernel } from "@/lib/kernel/forge-kernel";
import { buildShowcaseProjection } from "@/lib/showcase";

process.env.OPENAI_API_KEY =
  process.env.OPENAI_API_KEY ?? "test-key-for-fallback-proof";

const input = `Jess is mad at me for not contacting insurance.
I need to call the dentist before Friday.
Maxx asked me to help with his project again.`;

function hasForbiddenKeys(value: unknown): boolean {
  if (!value || typeof value !== "object") {
    return false;
  }

  if (Array.isArray(value)) {
    return value.some(hasForbiddenKeys);
  }

  return Object.entries(value).some(([key, nestedValue]) => {
    if (
      key.toLowerCase().includes("authorization") ||
      key.toLowerCase().includes("task")
    ) {
      return true;
    }

    return hasForbiddenKeys(nestedValue);
  });
}

async function main() {
  const execution = await new ForgeKernel().execute(input);
  const projection = await buildShowcaseProjection(execution);
  const output = projection.executiveOutput;

  const result = {
    hasExecutiveOutput: Boolean(output),
    suggestionCount: output.suggestions.length,
    allSuggestionsPending: output.suggestions.every(
      (suggestion) => suggestion.status === "pending"
    ),
    clarificationListExists: Array.isArray(output.clarifications),
    summaryMatchesSuggestions:
      output.summary.suggestionCount === output.suggestions.length,
    summaryMatchesClarifications:
      output.summary.clarificationCount === output.clarifications.length,
    noTaskOrAuthorizationLeakage: !hasForbiddenKeys(output),
  };

  if (
    !result.hasExecutiveOutput ||
    result.suggestionCount <= 0 ||
    !result.allSuggestionsPending ||
    !result.clarificationListExists ||
    !result.summaryMatchesSuggestions ||
    !result.summaryMatchesClarifications ||
    !result.noTaskOrAuthorizationLeakage
  ) {
    console.error("Today output proof failed.");
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }

  console.log("Today output proof passed.");
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
