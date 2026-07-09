# Forge OS Roadmap

## North Star

Given everything Forge knows about the user's life:

- What deserves attention?
- What should happen next?
- What is Forge still worried about?
- What does Forge need to ask?
- What can stop being on the user's mind?

The user should live their life.

Forge should keep up.

---

## Completed Foundations

### Cognitive Kernel

Forge has executable architecture for:

- source ingestion;
- interpretation;
- semantic understanding;
- grounding;
- relationships;
- memory;
- beliefs;
- worldview synthesis;
- reasoning;
- reflection;
- recommendations;
- authorization;
- action materialization;
- execution instrumentation.

### Source Import Architecture

Forge has provider-neutral architecture for:

- Source Documents;
- provider adapters;
- bounded orchestration;
- import sessions;
- resumability;
- checkpoints;
- durable import state;
- leases;
- cancellation;
- recovery.

### Executive Pipeline

Forge has executable architecture for:

- Executive Situations;
- executive reasoning;
- comparison;
- selection;
- attention;
- suggestions;
- clarification requests;
- executive output;
- presentation;
- Executive Concerns;
- concern projection;
- concern reconciliation;
- concern coordination;
- runtime concern integration;
- durable Executive Concern persistence;
- bounded Executive Recall projection;
- reasoning-safe Executive Recall Context;
- recall integration into real Showcase reasoning;
- executable longitudinal recall behavior.

---

## Current Architectural Phase

### Longitudinal Executive Product Experience

Current goal:

> Turn durable remembered concerns into a calm, trustworthy view of what matters now.

The real Showcase execution path now:

- projects Executive Concerns;
- reconciles repeated observations;
- persists concern state durably through Prisma;
- recalls a bounded set of relevant unresolved concerns;
- projects recalled concerns into reasoning-safe context;
- integrates remembered concern state into current executive reasoning;
- preserves recall provenance through executive output.

Executable longitudinal proof demonstrates that a concern created by one execution can influence a later execution even when the later input does not repeat the original concern.

The Showcase to Today bridge separately uses temporary file-backed Executive Session persistence.

These are intentionally different architectures.

The Executive Session must not become the Executive Memory model accidentally.

---

## Next Architectural Direction

### 1. Stronger Concern Identity

Replace presentation-derived concern identity with evidence-grounded stable identity.

Repeated situations should converge on the same concern even when wording changes.

Distinct situations should not collapse accidentally.

Concern identity should not depend on titles or presentation wording.

### 2. Explicit Concern Lifecycle

Define grounded lifecycle semantics for states such as:

- open;
- monitoring;
- waiting;
- blocked;
- resolved;
- dismissed.

Resolution must require evidence or operator input.

Absence is not resolution.

Resolved concerns remain part of executive history.

### 3. Morning Review

Project durable Executive Memory into a calm current-world executive review.

Morning Review should answer:

- what deserves attention;
- what should happen next;
- what remains unresolved;
- what needs clarification;
- what can leave the user's mind.

Morning Review is a read-side product projection.

It does not own Executive Memory.

It must use bounded, explicit executive state rather than dumping durable concern history directly into presentation or AI context.

### 4. Today Migration

Move Today from latest-session state to Morning Review derived from durable Executive Memory.

Today should represent the current state of the user's world rather than the most recent execution.

The temporary `FileExecutiveSessionStore` should remain explicitly temporary until this migration is complete.

### 5. Richer Longitudinal Executive Reasoning

Teach Forge to reason about change across concern history.

Examples include:

- repeated unresolved concerns;
- rising or falling importance;
- accumulating evidence;
- stale recommendations;
- recurring clarification needs;
- concerns that remain unresolved despite repeated attention.

Historical state should influence judgment through explicit bounded projections.

Do not expose all durable concern history directly to AI providers.

---

## Later Direction

After Executive Memory is durable, recall-capable, and product-visible:

- authorized actions;
- source connectors;
- change-driven executive runtime activation;
- operator feedback learning;
- historical executive trend reasoning;
- richer relationship understanding;
- richer commitment understanding.

---

## Intentionally Not Building Yet

Forge is not currently building:

- a generic task manager;
- a reminder application;
- notification systems;
- a background autonomous agent;
- engagement loops;
- automatic action execution.

Actions remain downstream and require explicit authorization.

Forge should not become another productivity system the user has to maintain.

---

## Roadmap Rule

Do not advance because a feature sounds useful.

Advance when the next architectural boundary:

- reduces cognitive load;
- improves grounded executive judgment;
- preserves operator agency;
- strengthens continuity across time;
- allows the user to tell Forge less.
