---
description: "Save a snippet into the current book — paste text or point at the chat. Example: /sendle:collect the summary above"
argument-hint: "<text, or a pointer to the chat above> [into <section>]"
---

Delegate to the **archivist** subagent (Task tool, `subagent_type: sendle:archivist`) and return only its one-line summary — do not call any `mcp__sendle__*` tool from the main thread.

The argument below may be **the text itself**, or a **pointer to content already in the chat** (e.g. "the conclusion above", "the code you just wrote"). If it points at existing content, **you (the main thread)** resolve it to that content's **exact, verbatim text** — never summarize or rewrite — and tell the archivist both the literal text and its `source` (`user` if you/the reader wrote or pasted it, `ai` if the assistant generated it).

Tell the archivist: **collect** this into the active book via `append_raw` (literal text + that `source`; if the instruction ends with "into <section>", treat that as the hierarchical path). If no book is currently collecting, create one first (draft a short title from the text) — never ask "which book". If the argument is empty, ask what to collect instead of calling any tool.

What to collect:

$ARGUMENTS

<!-- sendle-archive-request -->
