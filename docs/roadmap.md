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
- runtime concern integration.

---

## Current Architectural Phase

### Executive Memory

Current goal:

> Teach Forge to remember what still matters.

The real showcase execution path now projects Executive Concerns, reconciles repeated observations, and coordinates mutations into a shared concern repository.

Repeated observations can update one concern rather than replacing all executive state.

Executive Concerns are not yet durable across process restarts.

The Showcase to Today bridge separately uses temporary file-backed Executive Session persistence.

These are intentionally different architectures.

The Executive Session must not become the Executive Memory model accidentally.

---

## Next Architectural Direction

### 1. Durable Executive Concern Persistence

Introduce a proper persistence boundary and durable implementation for Executive Concerns.

Preserve:

- evidence accumulation;
- first observed time;
- last observed time;
- lifecycle state;
- recommendations;
- clarification needs;
- resolved history.

Durability must preserve the existing Executive Concern repository contract rather than leaking storage technology into executive reasoning.

### 2. Stronger Concern Identity

Replace title-derived concern identity with evidence-grounded stable identity.

Repeated situations should converge on the same concern even when wording changes.

Distinct situations should not collapse accidentally.

Concern identity should not depend on presentation wording.

### 3. Explicit Concern Lifecycle

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

### 4. Morning Review

Project Executive Memory into a calm daily executive review.

Morning Review should answer:

- what deserves attention;
- what should happen next;
- what remains unresolved;
- what needs clarification;
- what can leave the user's mind.

Morning Review is a projection from Executive Memory.

It does not own Executive Memory.

### 5. Today Migration

Move Today from latest-session state to Morning Review derived from Executive Memory.

Today should represent the current state of the user's world rather than the most recent execution.

---

## Later Direction

After Executive Memory is durable and trustworthy:

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
