---
name: send-to-reader
description: >-
  Use when the user wants to put reading onto their e-reader, or get something
  out of the chat onto their e-reader to read later — send, archive, or save it
  to their Kindle, Kobo, Boox, reMarkable, or any email-capable reader or inbox,
  as a clean EPUB. Covers a chat conclusion, a pasted passage, or a whole
  file/document (writing the report itself is single-html's job; this skill only
  delivers it). Triggers on phrasings like "send this to my Kindle", "send it to
  my reader / e-reader", "kindle this", "email me this as an EPUB", "send this
  to my e-reader to read later", "archive this to my reader with sendle", "add
  the summary above to sendle". Delegates to the sendle:archivist subagent; the
  main thread never calls Sendle tools directly.
---

# send-to-reader

The user wants something on their e-reader. Translate the plain-language intent
into one Sendle action and **delegate to the `sendle:archivist` subagent** (Task
tool, `subagent_type: sendle:archivist`); return only its one-line summary.
**Never call `mcp__sendle__*` / `mcp__sendle-local__*` tools from the main
thread** — only the archivist touches them.

Kindle is the common case, not the only one: any reader that accepts email works
(Kobo, Boox, reMarkable, or a plain inbox) — don't insist on the word "Kindle".

## Route the intent
- **A whole file / document** ("send this file", "kindle that doc", a path to a
  `.md` / `.html`) → resolve it to a concrete path and tell the archivist to
  `send_file_to_kindle(path)`. Pass the **path only** — never read or paste the
  file's contents. One-off; not saved to the library.
- **A passage or chat conclusion** ("add the summary above", "save this",
  "collect that") → resolve it to **verbatim text** (never summarize) plus its
  `source` (`user` if the reader wrote/pasted it, `ai` if the assistant
  generated it); the archivist collects it into the current book.
- **Review / manage** ("what's in my book", "drop #2", "list my books") → hand
  straight to the archivist.
- **Send the book** ("send it", "ship the book") → the archivist confirms the
  title, then assembles → EPUB → delivers.

## Resolve before delegating
The user usually **points at** content ("the conclusion above", "that report")
instead of spelling it out. You (the main thread) resolve the pointer to a
concrete value first — verbatim text for content, a real path for a file — and
pass concrete values only, never references. If the target is empty or
ambiguous, ask once. If no book is currently collecting, a collect opens one —
never ask "which book".
