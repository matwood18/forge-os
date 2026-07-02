import type { ObservationRecord } from "@/lib/kernel/observation/observation-repository";

export interface ObservationGroup {
  title: string;
  observations: ObservationRecord[];
}

export function groupObservations(
  observations: ObservationRecord[],
): ObservationGroup[] {
  const groups = new Map<string, ObservationRecord[]>();

  const now = new Date();

  for (const observation of observations) {
    const created = observation.createdAt;

    const diffDays = Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24),
    );

    let title = "Earlier";

    if (diffDays === 0) {
      title = "Today";
    } else if (diffDays === 1) {
      title = "Yesterday";
    } else if (diffDays < 7) {
      title = "This Week";
    } else if (diffDays < 30) {
      title = "This Month";
    }

    const existing = groups.get(title) ?? [];
    existing.push(observation);
    groups.set(title, existing);
  }

  return Array.from(groups.entries()).map(([title, observations]) => ({
    title,
    observations,
  }));
}