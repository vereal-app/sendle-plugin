---
description: "Build the current book into an EPUB and email it to your Kindle (the book is then done). Example: /sendle:send"
argument-hint: "[book]"
---

Delegate to the **archivist** subagent (Task tool, `subagent_type: sendle:archivist`) and return only its one-line summary — do not call any `mcp__sendle__*` tool from the main thread.

Tell the archivist: **send** the active book to Kindle. First confirm the title — show the book's current name and let the user rename it (`rename_book`) before sending; "go" or empty keeps it. Then `send_book` (one call runs assemble → EPUB → send → mark sent). If `$ARGUMENTS` names a book, send that one; otherwise the active book.

$ARGUMENTS

<!-- sendle-archive-request -->
