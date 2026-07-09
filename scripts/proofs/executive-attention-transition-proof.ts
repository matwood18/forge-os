import {
  BasicExecutiveAttentionTransitionEngine,
} from "@/lib/executive/attention-transition";

const engine =
  new BasicExecutiveAttentionTransitionEngine();

const surfacedToQuiet = engine.explain({
  transition: "surfaced_to_quiet",
});

if (
  surfacedToQuiet.transition !== "surfaced_to_quiet" ||
  !surfacedToQuiet.changed
) {
  throw new Error(
    "Surfaced to quiet transition explanation failed"
  );
}

const quietToSurfaced = engine.explain({
  transition: "quiet_to_surfaced",
});

if (
  quietToSurfaced.transition !== "quiet_to_surfaced" ||
  !quietToSurfaced.changed
) {
  throw new Error(
    "Quiet to surfaced transition explanation failed"
  );
}

const unchanged = engine.explain({
  transition: "unchanged",
});

if (
  unchanged.changed ||
  unchanged.transition !== "unchanged"
) {
  throw new Error(
    "Unchanged transition was incorrectly marked changed"
  );
}

const noPrevious = engine.explain({
  transition: "no_previous_state",
});

if (
  noPrevious.changed ||
  noPrevious.transition !== "no_previous_state"
) {
  throw new Error(
    "No previous state was not handled safely"
  );
}

console.log(
  "Executive attention transition proof passed."
);

console.log(
  JSON.stringify(
    {
      surfacedToQuiet: surfacedToQuiet.summary,
      quietToSurfaced: quietToSurfaced.summary,
      unchanged: unchanged.summary,
      noPrevious: noPrevious.summary,
    },
    null,
    2
  )
);
