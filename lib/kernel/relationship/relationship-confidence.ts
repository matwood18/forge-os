export function mergeRelationshipConfidence(
  existingConfidence: number,
  incomingConfidence: number,
): number {
  return Math.max(existingConfidence, incomingConfidence);
}