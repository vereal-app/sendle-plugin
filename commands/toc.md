---
description: "List the current book's items, each with a #N you can drop. Example: /sendle:toc"
argument-hint: "[book]"
disable-model-invocation: true
---

Delegate to the **archivist** subagent (Task tool, `subagent_type: sendle:archivist`) and return only its one-line summary — do not call any `mcp__sendle__*` tool from the main thread.

Tell the archivist: **show the table of contents** of the active book via `render_toc` and paste the rendered `text`. If `$ARGUMENTS` names a book, use it; otherwise the active book.

$ARGUMENTS
