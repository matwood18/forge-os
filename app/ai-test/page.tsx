import { StructuredOpenAIModel } from "@/lib/infrastructure/ai/openai";
import { ObservationCandidateListSchema } from "@/lib/kernel/reasoning/candidate-schema";
import { REASONING_SYSTEM_PROMPT } from "@/lib/kernel/reasoning/prompts";

export default async function AITestPage() {
  const model = new StructuredOpenAIModel();

  const observations = await model.generate(
    REASONING_SYSTEM_PROMPT,
    `
Met John Dade for coffee.

Doug introduced us.

He's interested in becoming a Riot dealer.
    `,
    ObservationCandidateListSchema
  );

  return (
    <pre className="p-8 whitespace-pre-wrap">
      {JSON.stringify(observations, null, 2)}
    </pre>
  );
}