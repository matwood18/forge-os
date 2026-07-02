export function mergeSupportingObservationIds(
  existingObservationIds: string[],
  incomingObservationIds: string[],
): string[] {
  return Array.from(
    new Set([...existingObservationIds, ...incomingObservationIds]),
  );
}