---
description: "Build an EPUB from a local .md/.html file and send it to Kindle (one-off, not saved). Example: /sendle:kindle ~/notes.md"
argument-hint: "<path to .md/.html, or a file from the chat>"
---

Delegate to the **archivist** subagent (Task tool, `subagent_type: sendle:archivist`) and return only its one-line summary — do not call any `mcp__sendle__*` tool from the main thread.

The argument below is normally a file path, but it may also **point at a file mentioned earlier in the chat** ("that doc above", "the html you just opened"). **You (the main thread)** resolve it to a concrete path from the conversation; if it's empty or ambiguous, list the file(s) you saw and ask which one. Hand the archivist **only the resolved path** — never read or paste the file's contents.

Tell the archivist: send that local document straight to Kindle via `send_file_to_kindle` (pass only the path).

Path / which file:

$ARGUMENTS

<!-- sendle-archive-request -->
