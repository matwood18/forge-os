import {
  BasicExecutiveAttentionReconciliationEngine,
} from "@/lib/executive/attention-reconciliation";

const engine =
  new BasicExecutiveAttentionReconciliationEngine();

const surfacedToQuiet = engine.reconcile({
  previousState: "surfaced",
  currentState: "quiet",
});

if (
  surfacedToQuiet.transition !== "surfaced_to_quiet" ||
  !surfacedToQuiet.changed
) {
  throw new Error(
    "Surfaced to quiet transition was not detected"
  );
}

const quietToSurfaced = engine.reconcile({
  previousState: "quiet",
  currentState: "surfaced",
});

if (
  quietToSurfaced.transition !== "quiet_to_surfaced" ||
  !quietToSurfaced.changed
) {
  throw new Error(
    "Quiet to surfaced transition was not detected"
  );
}

const unchanged = engine.reconcile({
  previousState: "quiet",
  currentState: "quiet",
});

if (
  unchanged.transition !== "unchanged" ||
  unchanged.changed
) {
  throw new Error(
    "Unchanged attention state was incorrectly marked changed"
  );
}

const noPrevious = engine.reconcile({
  currentState: "surfaced",
});

if (
  noPrevious.transition !== "no_previous_state" ||
  noPrevious.changed
) {
  throw new Error(
    "Missing previous attention state was not handled safely"
  );
}

console.log(
  "Executive attention reconciliation proof passed."
);

console.log(
  JSON.stringify(
    {
      surfacedToQuiet: surfacedToQuiet.transition,
      quietToSurfaced: quietToSurfaced.transition,
      unchanged: unchanged.transition,
      noPrevious: noPrevious.transition,
    },
    null,
    2
  )
);
