import type {
  ObservationCreateInput,
} from "@/lib/kernel/observation/observation-repository";

import type {
  ObservationProducer,
  ObservationProducerInput,
} from "@/lib/kernel/observation/producers/observation-producer";

export interface InteractionObservationInput
  extends ObservationProducerInput {
  summary: string;
  confidence?: number;
}

export class InteractionObservationProducer
  implements ObservationProducer<InteractionObservationInput>
{
  produce(
    input: InteractionObservationInput,
  ): ObservationCreateInput {
    return {
      subjectEntityId: input.subjectEntityId,

      predicate: "interaction_logged",

      objectValue: input.summary,

      objectEntityId: null,

      confidence: input.confidence ?? 1,

      sourceEventId: input.sourceEventId ?? null,
    };
  }
}