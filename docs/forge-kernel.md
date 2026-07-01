# Forge Kernel Specification

> Version 0.1
>
> The Forge Kernel is the central orchestration layer of Forge.
>
> It coordinates events, identity, interpretation, curiosity, memory, relationships, attention, and intentional action.

---

# 1. Purpose

The Kernel exists so Forge behaves like one coherent system instead of a collection of pages, services, and integrations.

Applications do not talk directly to engines.

Applications talk to the Kernel.

The Kernel coordinates the engines.

---

# 2. Kernel Principle

The Kernel does not exist to store data.

The Kernel exists to transform reality into intentional action.

```txt
Reality
  ↓
Event
  ↓
Interpretation
  ↓
Question or Memory
  ↓
Relationship
  ↓
Attention
  ↓
Intentional Action
```

---

# 3. Public Kernel API

The long-term Kernel API should feel simple:

```ts
forge.ingest(...)
forge.search(...)
forge.ask(...)
forge.resolveQuestion(...)
forge.getAttention(...)
forge.remember(...)
forge.act(...)
```

The application should not know which engines are involved.

---

# 4. Core Kernel Systems

## Event Store

Owns immutable Events.

Responsibilities:

- create Events
- preserve Events
- retrieve Events
- support correction Events
- maintain event history

The Event Store does not interpret meaning.

---

## Identity Resolution

Determines who or what an Event may involve.

Responsibilities:

- resolve Contacts to People
- resolve Contacts to Organizations
- detect Unknown identities
- calculate confidence
- request operator input when needed

Identity Resolution must not guess.

---

## Reasoning Engine

Creates Interpretations from Events, Memories, and context.

Responsibilities:

- summarize meaning
- detect patterns
- identify uncertainty
- propose interpretations
- explain confidence

The Reasoning Engine proposes understanding.

It does not own memory.

---

## Curiosity Engine

Creates Questions when additional operator input would materially improve understanding.

Responsibilities:

- ask the smallest useful question
- rank questions by impact
- avoid noisy questioning
- close questions when resolved

Questions are not failures.

Questions are how Forge learns.

---

## Memory Engine

Owns durable understanding.

Responsibilities:

- create Memories
- update Memories
- preserve Memory history
- link Memories to Interpretations
- expose supporting evidence

Memories are operator-owned and editable.

---

## Relationship Engine

Models the evolving relationship between the Operator and another identity.

Responsibilities:

- aggregate Memories
- track relationship context
- detect changes in relationship health
- surface relationship patterns
- support business and personal relationship contexts

Relationships emerge from history.

They are not manually manufactured records.

---

## Attention Engine

Determines what deserves the Operator's finite attention.

Responsibilities:

- calculate impact
- respect intention mode
- respect notification budget
- evaluate commitments
- evaluate opportunities
- protect silence

Attention is advisory.

The Operator decides.

---

## Action Engine

Turns attention into possible Intentional Actions.

Responsibilities:

- suggest actions
- explain expected impact
- link actions to relationships
- track completion
- learn from operator choices

Tasks are one type of Intentional Action.

---

# 5. Dependency Rules

The Kernel owns engine orchestration.

Engines should not freely depend on each other.

Preferred direction:

```txt
Kernel
  ↓
Engines
  ↓
Domain
```

Engines may depend on Domain types.

Engines should not depend on UI.

Engines should not depend on Next.js.

Engines should not depend on React.

Engines should not depend directly on connector payloads unless they are explicitly connector engines.

---

# 6. Application Boundary

The web app is only one client of the Kernel.

Future clients may include:

- mobile app
- desktop app
- CLI
- background worker
- browser extension
- MCP server
- API server

No client should need to reimplement Forge logic.

---

# 7. Synchronous vs Asynchronous Work

Some Kernel work can be synchronous.

Examples:

- creating an Event
- returning a basic ingest result
- creating a Question
- calculating simple impact

Some Kernel work should eventually be asynchronous.

Examples:

- AI interpretation
- memory consolidation
- relationship health recalculation
- connector sync
- background identity matching
- attention briefing generation

The Kernel API should hide this complexity from applications where possible.

---

# 8. Kernel Ingest Flow

The canonical ingest flow:

```txt
Input
  ↓
Normalize Event
  ↓
Store Event
  ↓
Resolve Identity
  ↓
Reason About Event
  ↓
Create Questions if needed
  ↓
Update Memories if appropriate
  ↓
Update Relationship Context
  ↓
Evaluate Attention
  ↓
Return Kernel Result
```

Early versions may implement only part of this flow.

The shape should remain stable.

---

# 9. Kernel Result

A Kernel operation should return understanding, not just IDs.

Example:

```ts
{
  event,
  interpretations,
  questions,
  memories,
  attentionItems
}
```

The UI should be able to render what happened without performing domain reasoning itself.

---

# 10. Confidence

Confidence is part of Kernel behavior.

Any system that interprets, matches, remembers, or recommends should expose confidence.

Confidence should be visible where it affects operator decisions.

Forge must never pretend certainty where uncertainty exists.

---

# 11. Questions

When confidence is insufficient, Forge should ask.

Questions should include:

- prompt
- reason
- impact
- related evidence
- possible answers
- confidence benefit

Questions should be prioritized.

Forge should ask fewer questions over time as it learns.

---

# 12. Attention Budget

The Attention Engine should eventually support a notification budget.

Forge should not interrupt merely because something happened.

Interruptions must earn attention.

Silence is a feature.

---

# 13. Operator Agency

The Kernel may recommend.

The Kernel may explain.

The Kernel may ask.

The Kernel may rank options.

The Kernel may not choose important relationship actions on behalf of the Operator without explicit permission.

---

# 14. Privacy Boundary

The Kernel may only use data the Operator has authorized.

Shared memory must be explicit.

Private memory must remain private.

No engine may assume it has permission to share information simply because it can access it.

---

# 15. Anti-Patterns

Avoid:

- UI-driven business logic
- page-specific reasoning
- connector-specific domain logic
- AI outputs treated as facts
- identity guessing
- notification spam
- hidden confidence
- hidden reasoning
- raw payload leakage
- duplicated relationship logic

---

# 16. Naming Guidance

Prefer system names that describe behavior.

Recommended:

- Event Store
- Identity Resolution
- Reasoning Engine
- Curiosity Engine
- Memory Engine
- Relationship Engine
- Attention Engine
- Action Engine

Avoid vague names:

- utils
- helpers
- service
- manager
- misc

---

# 17. Current Implementation Status

As of v0.1:

Implemented:

- ForgeKernel shell
- Event ingest path
- BasicEventIngestor
- Identity resolution contracts
- Question domain type
- Registry foundation

Not yet implemented:

- persistent Event Store
- Reasoning Engine
- Curiosity Engine
- Memory Engine
- Relationship Engine
- Attention Engine
- Action Engine
- database persistence
- connector ingestion

---

# 18. Near-Term Roadmap

## Stage 1

Strengthen Event domain type.

## Stage 2

Return richer Kernel ingest result.

## Stage 3

Create Question objects during uncertain identity resolution.

## Stage 4

Add in-memory repositories.

## Stage 5

Create first real Event timeline.

## Stage 6

Introduce database persistence.

---

# 19. Design Rule

No new engine should be implemented without first answering:

1. What does this engine own?
2. What does this engine never own?
3. What inputs does it accept?
4. What outputs does it produce?
5. What confidence does it expose?
6. What questions can it create?
7. How does it respect the Constitution?

---

# 20. Summary

The Forge Kernel is the brain of Forge.

It coordinates the transformation of raw events into understanding, memory, relationship context, attention, and intentional action.

The Kernel protects the application from becoming a pile of pages.

The Kernel protects the domain from being polluted by UI concerns.

The Kernel protects the Operator by preserving agency, exposing uncertainty, and ensuring Forge learns through humility rather than guessing.

Forge does not merely store what happened.

Forge helps decide what matters.