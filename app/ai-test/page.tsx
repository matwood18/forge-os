import { StructuredOpenAIModel } from "@/lib/infrastructure/ai/openai";
import { ObservationCandidateListSchema } from "@/lib/kernel/reasoning/candidate-schema";
import { REASONING_SYSTEM_PROMPT } from "@/lib/kernel/reasoning/prompts";

const OBSERVATION_OUTPUT_PROMPT = `
${REASONING_SYSTEM_PROMPT}

You MUST return JSON in exactly this shape:

{
  "observations": [
    {
      "kind": "possible-person",
      "value": "John Dade",
      "confidence": 0.95,
      "source": "Mentioned by name."
    }
  ]
}

Allowed kind values:
- possible-person
- possible-organization
- possible-location
- activity
- commitment
- follow-up
- relationship
- business-opportunity
- unknown

Return ONLY JSON.
`.trim();

export default async function AITestPage() {
  const model = new StructuredOpenAIModel();

  const observations = await model.generate(
    OBSERVATION_OUTPUT_PROMPT,
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
