---
description: "Build an EPUB from a local .md/.html file and send it to Kindle (one-off, not saved). Example: /sendle:kindle ~/notes.md"
argument-hint: "<path to .md/.html, or a file from the chat>"
disable-model-invocation: true
---

A file send is **one direct call** to the sendle-local `send_file_to_kindle` MCP tool (`mcp__plugin_sendle_sendle-local__send_file_to_kindle`) — do NOT delegate to a subagent, and NEVER read or paste the file's contents: the tool reads the file locally and uploads it, so the content never passes through the model.

The argument below is normally a file path, but it may also **point at a file mentioned earlier in the chat** ("that doc above", "the html you just opened"). Resolve it to a concrete path from the conversation; if it's empty or ambiguous, list the file(s) you saw and ask which one.

Call `send_file_to_kindle` with only the resolved `path` (add `title` only if the user names one), then reply with one line from the receipt.

Path / which file:

$ARGUMENTS
