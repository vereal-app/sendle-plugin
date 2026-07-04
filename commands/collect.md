---
description: "Save a snippet into the current book — paste text or point at the chat. Example: /sendle:collect the summary above"
argument-hint: "<text, or a pointer to the chat above> [into <section>]"
---

Collecting is **one direct call** to the sendle `collect` MCP tool (`mcp__plugin_sendle_sendle__collect`) — a single zero-judgment composite; do NOT delegate to a subagent for this.

The argument below may be **the text itself**, or a **pointer to content already in the chat** (e.g. "the conclusion above", "the code you just wrote"). If it points at existing content, resolve it to that content's **exact, verbatim text** — never summarize or rewrite. If the argument is empty, ask what to collect instead of calling any tool.

Call `collect` with:

- `content` — the literal text
- `source` — `user` if you/the reader wrote or pasted it, `ai` if the assistant generated it
- `section` — only if the instruction ends with "into <section>"

The tool appends to the book currently collecting, or opens a new one named from the content — never ask "which book". Reply with one line from the receipt: collected into *<title>*, fragment N (say so if a new book was opened).

What to collect:

$ARGUMENTS
