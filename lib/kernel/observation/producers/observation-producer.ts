import type {
  ObservationCreateInput,
  ObservationRecord,
  ObservationRepository,
} from "@/lib/kernel/observation/observation-repository";

export type ObservationProducerInput = {
  subjectEntityId: string;
  sourceEventId?: string | null;
};

export interface ObservationProducer<TInput extends ObservationProducerInput> {
  produce(input: TInput): ObservationCreateInput;
}

export async function produceObservation<TInput extends ObservationProducerInput>(
  repository: ObservationRepository,
  producer: ObservationProducer<TInput>,
  input: TInput,
): Promise<ObservationRecord> {
  const observation = producer.produce(input);

  return repository.remember(observation);
}