# Forge OS Development Workflow

## Purpose

This document defines the development workflow for Forge OS.

The goal is to preserve architectural discipline, reduce accidental scope expansion, protect unrelated work, and make development continuity possible across fresh chats.

---

## Core Rule

Work one architectural ticket at a time.

Each ticket should establish one coherent:

- contract;
- boundary;
- behavior;
- integration;
- architectural decision;
- documentation concern.

Do not combine unrelated architecture, cleanup, product work, and documentation changes into one ticket.

---

## Inspect Before Editing

Inspect the relevant architecture before proposing changes.

When multiple files are needed, request all of them in one batch.

Do not request files one at a time when the necessary inspection set can be identified up front.

Before touching already-modified files, inspect their exact diffs.

Prefer targeted commands:

- `find`;
- `sed`;
- `cat`;
- `git status`;
- `git diff`;
- `git log`;
- `npm run forge:status`.

Avoid recursive `grep -R` searches.

---

## File Changes

Prefer complete file replacements when practical.

Use deterministic Python patch scripts for multi-file edits.

When introducing new files, provide `mkdir -p` and `touch` scaffolding first.

Patch scripts should:

- fail loudly when expected targets are missing;
- avoid broad accidental replacements;
- preserve unrelated dirty work;
- produce deterministic output.

Do not add TODO placeholders unless they represent intentional extension points.

---

## Large Generated Artifacts

Large documents and generated artifacts should be written and verified one file at a time.

Do not combine many large document bodies and unrelated repository mutations into one patch script.

When Markdown contains fenced code blocks, avoid nesting literal triple-backtick fences inside chat code blocks in ways that can truncate the delivered command.

Prefer deterministic Python generation using a constructed fence value when needed.

After writing a large artifact, verify:

- line count;
- expected section headings;
- beginning of file;
- end of file;
- Git status.

Do not commit an artifact merely because the write command exited successfully.

Verify the resulting file contents first.

---

## Architecture

Protect kernel contracts.

Prefer explicit domain models and boundaries.

Do not hide architectural contradictions behind UI behavior.

When a proof exposes a design problem, fix the contract or implementation rather than weakening the proof.

Temporary architecture must be named and documented honestly.

Do not allow temporary persistence or product bridges to become permanent architecture accidentally.

---

## Proofs

Executable proofs protect architectural behavior.

Every architectural ticket should add or update relevant proof coverage when behavior changes.

Proofs should validate meaningful contracts and invariants.

When a proof fails because it exposes a real architectural contradiction, fix the architecture.

Do not weaken the proof merely to make it pass.

---

## Validation

Every ticket ends with relevant executable proofs and:

`npm run lint`

Milestones additionally end with:

`npm run build`

`npm run forge:status`

Run broader regression proofs when shared architecture changes.

---

## Git Discipline

Inspect `git status` before staging.

Stage only files belonging to the current ticket.

When working-tree changes predate the ticket, inspect the exact diff before staging.

Commit one architectural ticket at a time.

Push at coherent checkpoints.

Do not commit temporary inspection artifacts.

Do not commit generated `.forge/` artifacts.

---

## Dirty Working Trees

A dirty working tree is not automatically a problem.

Unrelated dirty work must be understood and preserved.

Before staging:

1. inspect `git status`;
2. identify which files belong to the current ticket;
3. inspect diffs for already-modified files;
4. stage only the intended files;
5. verify status after commit.

Do not use broad staging commands when unrelated changes exist.

---

## Temporary Artifacts

Temporary inspection files must be deleted before closing a phase.

`.forge/` is reserved for generated local Forge artifacts and temporary runtime/debug persistence.

Current examples include:

- temporary Executive Session persistence;
- future generated handoff artifacts.

Generated artifacts are not architectural source of truth.

---

## Documentation

The repository is the source of truth for project continuity.

Current canonical documents include:

- `docs/forge-constitution.md`;
- `docs/domain-model.md`;
- `docs/event-model.md`;
- `docs/forge-kernel.md`;
- `docs/executive-system.md`;
- `docs/roadmap.md`;
- `docs/development-workflow.md`.

Update documentation when:

- architecture materially changes;
- product direction changes;
- temporary architecture is introduced or removed;
- workflow rules change;
- the next architectural direction changes.

Documentation should explain why architecture exists, not merely list files.

---

## Handoff Discipline

A fresh chat should not need to reconstruct Forge OS from conversation history.

A handoff should preserve:

- what Forge is becoming;
- current architecture;
- latest completed architectural boundary;
- why recent decisions were made;
- temporary architecture;
- intentionally out-of-scope work;
- current Git state;
- recent commit history;
- development workflow;
- next architectural direction.

The repository should provide the maintained context.

A generated handoff should package that context with live repository state.

---

## Phase Close

Before closing a phase:

1. resolve or explicitly preserve experimental code;
2. delete temporary inspection artifacts;
3. run relevant proofs;
4. run `npm run lint`;
5. run `npm run build`;
6. run `npm run forge:status`;
7. update canonical documentation;
8. generate the repository handoff;
9. inspect the generated handoff;
10. commit documentation and handoff tooling;
11. push;
12. verify clean or intentionally understood Git state.

---

## Development Principle

Move quickly by making architectural progress explicit.

One ticket.

One boundary.

One proof.

One understood commit.

Then continue.
