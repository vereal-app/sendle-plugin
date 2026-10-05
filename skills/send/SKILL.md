---
name: send
description: "Send the user's collected Sendle book to their e-reader. With no argument it only reports the title to confirm. Runs in the archivist."
argument-hint: "[go | rename: <title> | <book title>]"
context: fork
agent: sendle:archivist
background: false
---

Send the user's Sendle book. The request:

$ARGUMENTS

- **Empty** → do NOT send. Find the active (collecting) book (`list_books`) and reply exactly:
  `Ready to send *<title>* (<N> items). Ask the user: send as-is, or rename? Then invoke the sendle:send skill with "go" or "rename: <new title>".`
  If no book is collecting, say so in one line instead.
- **"go"** → `send_book(active book)` once.
- **"rename: <title>"** → `send_book(active book, title: "<title>")` once — it renames and sends in one call.
- **A book title** → `list_books`, take the book whose title matches exactly (typing its name is the confirmation), `send_book` it once; if none matches, list the titles instead.

Reply with one line from the receipt: sent *<title>* (N chapters). If the receipt carries a `note` (e.g. delivered to the inbox because no e-reader is set), add it verbatim. If the tool returns an error, relay its message as-is.
