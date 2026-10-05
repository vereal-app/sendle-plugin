---
name: toc
description: "Show or manage the user's Sendle book: contents with #N, drop an item, rename, list books. Runs in the archivist."
argument-hint: "[drop #N | rename: <title> | list books]"
context: fork
agent: sendle:archivist
background: false
---

Act on the user's Sendle book. The request (empty means "show the table of contents"):

$ARGUMENTS

- **Empty / "show"** → `render_toc` on the active (collecting) book and paste its `text` verbatim, then add one line: *to remove an item, say "drop #N".*
- **"drop #N"** (or a title/preview) → `render_toc` first (the numbering is recomputed every round), map `#N` to its `fragment_id`, then `discard_raw`. If the reference is ambiguous, list the candidates instead of guessing.
- **"rename: <title>"** → `rename_book` on the active book.
- **"list books"** → `list_books`: the collecting book plus the few most recent sent ones (title · status · item count); fold older ones into "+N older".

If no book is collecting, say so in one line (the next collect opens a fresh one). Reply with the result only.
