# Forge OS Executive System

## Purpose

The Executive System turns Forge's understanding of the user's world into calm, grounded executive guidance.

It exists to help answer:

- What deserves attention?
- What should happen next?
- What is Forge still worried about?
- What does Forge need to ask?
- What can stop being on the user's mind?

Forge is an executive function.

Forge is not a generic productivity app, todo list, reminder app, notification system, or autonomous background agent.

Actions remain downstream and require explicit authorization.

---

## Product Principle

The user should live their life.

Forge should keep up.

The Executive System should reduce the amount the user must remember, record, organize, and explain.

Deep reasoning should remain inspectable.

Internal reasoning should not dominate the default product experience.

---

## Current Executive Pipeline

The current executive architecture flows:

```text
Understanding
        ↓
Reasoning
        ↓
Comparison
        ↓
Selection
        ↓
Attention
        ↓
Suggestions and Clarifications
        ↓
Executive Concern Projection
        ↓
Executive Concern Reconciliation
        ↓
Executive Concern Coordination
        ↓
Executive Concern Repository
```

This pipeline marks the shift from a cognitive kernel toward an executive operating system.

Each layer owns a different responsibility.

The layers should not collapse into one another merely because they currently share data.

---

## Understanding

Understanding converts source material into evidence-bearing representations of the user's world.

Current understanding architecture includes:

- interpretation;
- entity mention extraction;
- semantic claims;
- semantic claim relations;
- grounding;
- observations;
- relationships;
- memories;
- beliefs;
- worldview synthesis.

Understanding should preserve uncertainty.

AI may propose meaning.

Structured systems preserve evidence, provenance, contracts, and history.

Understanding is not executive judgment.

It provides grounded material from which executive judgment can operate.

---

## Executive Situations

Executive Situations represent evidence-grounded circumstances that may affect what deserves attention.

Situations may represent:

- unresolved responsibilities;
- relationship impact;
- deadlines;
- dependencies;
- blocked work;
- concrete next steps;
- uncertainty requiring clarification.

Executive Situations are not Tasks.

They are inputs to executive reasoning.

The AI Executive Situation provider may interpret open-ended human meaning.

Deterministic fallback behavior preserves system operation when AI interpretation is unavailable or rejected.

---

## Reasoning

Executive Reasoning determines what appears to matter and why.

A reasoned priority contains:

- title;
- rationale;
- suggested next step;
- evidence IDs;
- confidence.

Reasoning is upstream of presentation.

Users should not see internal reasoning by default.

Reasoning must remain inspectable when the user asks why or when the system is being debugged.

Reasoning must remain grounded in evidence.

Forge should not fabricate priorities when evidence does not support them.

---

## Comparison

Executive Comparison evaluates competing priorities.

Comparison may consider:

- deadlines;
- blocked work;
- dependencies;
- relationship impact;
- concrete next steps;
- consequence.

Comparison influences ordering.

Comparison does not decide presentation by itself.

Comparison signals should remain internal unless they are intentionally projected into an explanation.

The existence of comparison logic allows Forge to move from:

> This matters.

Toward:

> Given everything else that matters, this deserves more attention.

---

## Selection

Executive Selection decides whether priorities should continue toward executive attention.

Current selection decisions are:

- `surface`;
- `quiet`.

Selection preserves signals and evidence.

Priorities requiring user attention are promoted even when they do not exceed a generic executive-weight threshold.

This prevents an architectural contradiction where Forge concludes that user action appears required while simultaneously refusing to surface the priority.

Selection is not presentation.

Selection is a decision boundary between compared priorities and executive attention.

---

## Attention

Executive Attention answers:

> What appears to deserve attention now?

Attention is execution-adjacent executive state.

Attention may be surfaced or quietly tracked.

Attention explains why something matters.

Attention is not durable Executive Memory.

The current attention architecture includes:

- attention projection;
- attention memory;
- attention reconciliation;
- attention transition reasoning;
- runtime integration.

Attention should progressively diverge from Suggestions in product behavior.

```text
Attention
(why this matters)
        ↓
Suggestion
(what to do)
```

The two should not remain duplicate presentations of the same information.

---

## Suggestions

Suggestions answer:

> What could happen next?

A Suggestion is advisory.

A Suggestion is not a Task.

A detected situation is not a Task.

A reasoned priority is not a Task.

Executive Attention is not a Task.

A Task or durable intended action exists only after intentional acceptance and authorization.

Suggestions may contain:

- title;
- rationale;
- suggested next step;
- evidence;
- confidence;
- status.

Suggestions should reduce decision burden without silently taking ownership of the user's choices.

---

## Clarifications

Clarification is first-class executive function.

Forge should ask when uncertainty materially changes:

- priority;
- commitment;
- urgency;
- relationship impact;
- recommended next step.

A Clarification Request should preserve:

- the question;
- why Forge is asking;
- the uncertainty;
- relevant situations;
- evidence;
- confidence.

Forge should ask fewer, better questions.

Clarification exists to improve executive judgment, not to create conversational engagement.

---

## Executive Concerns

An Executive Concern represents something Forge still believes matters across executions.

Executive Concerns are the current foundation of Executive Memory.

A concern contains:

- stable identity;
- title;
- lifecycle status;
- importance;
- confidence;
- first observed time;
- last observed time;
- supporting evidence;
- latest recommendation;
- clarification need;
- resolution history.

A concern is not an execution result.

A concern is not a session.

A concern is not a Task.

A concern represents durable executive continuity.

Resolved concerns remain part of executive history rather than disappearing.

Absence from one execution must not automatically resolve, dismiss, or delete a concern.

---

## Executive Concern Repository

The Executive Concern Repository owns concern storage behind an explicit repository contract.

Current repository behavior includes:

- saving concerns;
- updating concerns;
- finding concerns by identity;
- listing concerns;
- listing concerns by lifecycle status;
- clearing repository state for controlled proof isolation.

The repository boundary should survive changes in persistence technology.

Executive reasoning, projection, and reconciliation should not depend directly on Prisma, SQLite, files, or another storage implementation.

---

## Executive Concern Projection

Executive Concern Projection converts execution-adjacent executive output into concern observations.

The current projector consumes:

- Executive Attention;
- Executive Output.

It produces:

- `ExecutiveConcernObservation[]`.

Projection preserves evidence.

Projection may include the latest recommendation.

Projection must not fabricate clarification needs.

Projection is a translation boundary.

It does not own concern history.

---

## Executive Concern Reconciliation

Executive Concern Reconciliation determines how a new observation changes existing executive state.

Current behavior includes:

- creating previously unseen concerns;
- ignoring duplicate observations;
- updating repeated concerns;
- accumulating novel evidence;
- preserving `firstObserved`;
- advancing `lastObserved`;
- updating confidence when new confidence is observed;
- rejecting mismatched concern identity;
- preserving concerns when no explicit resolution evidence exists.

Absence is not resolution.

The reconciliation engine does not currently infer automatic resolution.

Reconciliation should remain explicit and evidence-grounded.

---

## Executive Concern Coordination

Executive Concern Coordination owns the orchestration between projected observations, reconciliation, and repository mutation.

The current coordination flow is:

```text
Concern Observation
        ↓
Repository Lookup
        ↓
Reconciliation
        ↓
Create | Update | No Change
        ↓
Repository Mutation
```

The coordinator prevents runtime integration code from owning concern lifecycle semantics.

Repeated observations can update one concern rather than replacing all executive state.

Duplicate observations can leave repository state unchanged.

---

## Executive Memory Write Path

The complete current write path is:

```text
Source Input
        ↓
Forge Kernel Execution
        ↓
Showcase Projection
        ↓
Executive Attention + Executive Output
        ↓
BasicExecutiveConcernProjector
        ↓
ExecutiveConcernObservation[]
        ↓
BasicExecutiveConcernCoordinator
        ↓
ExecutiveConcernRepository Lookup
        ↓
BasicExecutiveConcernReconciliationEngine
        ↓
Create | Update | No Change
        ↓
ExecutiveConcernRepository Mutation
```

The real `/api/forge-showcase/execute` route is connected to this write path.

This proves that the Executive Concern architecture is integrated into a real product execution path rather than existing only in isolated proofs.

---

## Current Runtime Behavior

The current runtime can:

- execute real Forge input;
- build the Showcase Projection;
- project Executive Concern observations;
- coordinate observations against existing concerns;
- create previously unseen concerns;
- update repeated concerns;
- accumulate evidence;
- preserve first observation time;
- advance last observation time;
- update confidence;
- preserve unresolved concerns.

The current runtime does not yet provide durable Executive Concern state across process restarts.

---

## Current Persistence Boundaries

### Executive Concerns

Executive Concerns currently use a shared in-memory repository.

This proves runtime accumulation within a server process.

It is not durable across process restarts.

Durable Executive Concern persistence remains future architecture.

The next persistence implementation should preserve the existing repository boundary.

### Executive Session

The Showcase to Today bridge currently uses `FileExecutiveSessionStore`.

The latest executive projection is written to:

```text
.forge/executive-session.json
```

This is temporary debug/product persistence.

It exists so `/today` can consume the latest executive projection across requests.

It must not become the durable Executive Memory model accidentally.

The Executive Session answers:

> What was the latest executive projection?

Executive Memory should answer:

> What does Forge still believe matters?

These are different responsibilities.

---

## Today

The current Today hierarchy is:

```text
Good morning
        ↓
Forge is watching
        ↓
What matters today
        ↓
Forge needs one answer
```

This hierarchy is the current product direction.

Today currently consumes the latest Executive Session.

The current Today experience may present both surfaced and quietly tracked executive attention.

`Forge is watching` and `What matters today` should progressively diverge.

The intended distinction is:

```text
Forge is watching
        ↓
Attention
Why this matters

What matters today
        ↓
Suggestion
What to do
```

Today should remain calm and concise.

Internal reasoning should remain available without becoming the default experience.

---

## Executive Memory

Executive Memory is the accumulated set of Executive Concerns and their histories.

Executive Memory should answer:

> What does Forge still believe matters?

Executive Memory is not the latest execution.

Executive Memory is not the latest session.

Executive Memory is not a task list.

Executive Memory is the durable executive representation of the user's evolving world.

The current Executive Concern architecture establishes the write-side foundation for Executive Memory.

Durable persistence, stronger identity, lifecycle semantics, and read-side projection remain future work.

---

## Morning Review

Morning Review is the future read-side projection of Executive Memory.

Morning Review should answer:

- What deserves attention?
- What should happen next?
- What remains unresolved?
- What is Forge still worried about?
- What does Forge need to ask?
- What can stop being on the user's mind?

Morning Review is a product projection.

Morning Review does not own Executive Memory.

Morning Review should derive from the current state and history of Executive Concerns.

---

## Target Architecture

The target architecture is:

```text
Execution
        ↓
Executive Attention
        ↓
Executive Memory
        ↓
Morning Review
        ↓
Today
```

The fundamental product transition is:

From:

> What happened last?

To:

> Given everything Forge knows, what still matters now?

An executive assistant should represent the current state of the user's world, not merely the most recent execution.

---

## Reasoning Visibility

Forge should maintain two product layers.

### Default Experience

The default experience should show:

- what matters;
- why it matters in concise form;
- what Forge suggests;
- what Forge needs to ask.

### Inspectable Experience

When requested, Forge should be able to expose:

- supporting evidence;
- confidence;
- reasoning;
- comparison signals;
- selection decisions;
- attention transitions;
- concern history;
- recommendation history.

Reasoning should be available.

Reasoning should not become clutter.

---

## Operator Agency

Forge proposes interpretations.

Forge surfaces attention.

Forge makes suggestions.

Forge asks clarifying questions.

The operator decides.

Actions remain downstream and require explicit authorization.

Executive Memory must not become a mechanism for silently converting inference into commitments.

---

## Intentionally Out of Scope

The current Executive System is not building:

- a generic todo list;
- a reminder app;
- notifications;
- a background autonomous agent;
- a generic task manager;
- automatic action execution.

Forge should not become another productivity system the user has to maintain.

Actions remain downstream and require explicit authorization.

---

## Architectural Invariants

The Executive System should preserve these invariants:

1. Executive output remains grounded in evidence.
2. Uncertainty is preserved rather than hidden.
3. Current execution is distinct from durable executive state.
4. Attention is distinct from Suggestion.
5. Suggestion is distinct from Task.
6. Absence is not resolution.
7. Resolved concerns remain part of executive history.
8. Persistence technology remains behind explicit boundaries.
9. Internal reasoning remains inspectable.
10. Operator agency is preserved.
11. Temporary architecture is named honestly.
12. The user should have to maintain less software as Forge improves.

---

## Current Architectural Priority

Teach Forge to remember what still matters.

The next major architectural questions are:

1. durable Executive Concern persistence;
2. stronger concern identity than title-derived slugs;
3. explicit concern lifecycle and resolution semantics;
4. Morning Review projection from Executive Memory;
5. migration of Today away from latest-session state.

Do not skip directly to generic task management or autonomous action execution.
