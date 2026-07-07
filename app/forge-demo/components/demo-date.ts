// app/forge-demo/components/demo-date.ts
const DEMO_TIME_ZONE = "America/Chicago";

export function formatDemoDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: DEMO_TIME_ZONE,
  }).format(date);
}

export function formatDemoTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeStyle: "medium",
    timeZone: DEMO_TIME_ZONE,
  }).format(date);
}