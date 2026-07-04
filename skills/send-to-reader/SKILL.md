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
  the summary above to sendle". One-shot collects and file sends are single
  direct tool calls; book review and sending run in the sendle:archivist
  subagent.
---

# send-to-reader

The user wants something on their e-reader. Translate the plain-language intent
into one Sendle action. **One-shot actions (collect a passage, send a file) are
a single direct MCP tool call.** Book review, management, and sending run in the
**`sendle:archivist`** subagent (Task tool, `subagent_type: sendle:archivist`) —
return only its one-line summary and keep archiving noise out of the main
thread.

Kindle is the common case, not the only one: any reader that accepts email works
(Kobo, Boox, reMarkable, or a plain inbox) — don't insist on the word "Kindle".

## Route the intent
- **A whole file / document** ("send this file", "kindle that doc", a path to a
  `.md` / `.html`) → resolve it to a concrete path and call
  `send_file_to_kindle(path)` directly. Pass the **path only** — never read or
  paste the file's contents (the tool reads it locally; the content never
  passes through the model). One-off; not saved to the library.
- **A passage or chat conclusion** ("add the summary above", "save this",
  "collect that") → resolve it to **verbatim text** (never summarize) plus its
  `source` (`user` if the reader wrote/pasted it, `ai` if the assistant
  generated it) and call `collect` directly — it appends to the book currently
  collecting or opens a new one.
- **Review / manage** ("what's in my book", "drop #2", "list my books") → hand
  straight to the archivist.
- **Send the book** ("send it", "ship the book") → two rounds via the
  archivist: first delegation reports the book's title (a subagent can't ask
  the user anything), the user confirms or renames, second delegation sends.

## Resolve before acting
The user usually **points at** content ("the conclusion above", "that report")
instead of spelling it out. You (the main thread) resolve the pointer to a
concrete value first — verbatim text for content, a real path for a file — and
pass concrete values only, never references. If the target is empty or
ambiguous, ask once. If no book is currently collecting, a collect opens one —
never ask "which book".

## If a tool reports authorization_required
Relay the link and code to the user verbatim (they can open it on any device —
phone or laptop), then retry the same call after they confirm they approved:
the pending login is remembered and completes automatically. To check or repair
authorization explicitly, call the sendle-local `authorize` tool.
