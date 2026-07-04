---
description: "Build the current book into an EPUB and email it to your Kindle (the book is then done). Example: /sendle:send"
argument-hint: "[book, or 'go' to send as-is]"
disable-model-invocation: true
---

Delegate to the **archivist** subagent (Task tool, `subagent_type: sendle:archivist`) and return only its one-line summary — do not call any `mcp__sendle__*` tool from the main thread.

Sending is a **two-round** conversation, because a subagent cannot ask the user anything and every delegation is a fresh archivist:

1. **Title check** — if `$ARGUMENTS` doesn't already confirm or name a book: delegate "report the active book's current title — do not send". Relay the title and ask the user: send as-is, or rename?
2. **Send** — on the user's answer, delegate once more: rename first (`rename_book`) if they gave a new name, then `send_book` (one call runs assemble → EPUB → send → mark sent).

Skip round 1 and send directly when `$ARGUMENTS` clearly confirms ("go") — or names a book, in which case send that one (typing its name is the confirmation).

$ARGUMENTS
