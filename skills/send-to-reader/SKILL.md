---
name: send-to-reader
description: >-
  Use when the user wants something on their Kindle or e-reader (Kobo, Boox,
  reMarkable, any reader or inbox that takes email) to read later, or wants to
  manage the Sendle book they are collecting. Covers sending a whole .md/.html
  file, collecting a chat conclusion or pasted passage, reviewing / trimming /
  renaming / sending the book, and (re)connecting Sendle. Triggers on phrasings
  like "send this to my Kindle", "kindle this file", "put notes.md on my
  reader", "add the summary above to sendle", "save that for later reading",
  "what's in my book", "drop #2", "send the book", "reconnect sendle" — and the
  same in any language, e.g. 「把这个文件发到 Kindle」「把上面的总结存进
  sendle」「收藏这段，回头在阅读器上看」「我的书里有什么」「删掉第 2
  条」「把书发出去」「重新连接 sendle」. Writing a report itself is
  single-html's job; this skill only delivers it.
user-invocable: false
---

# send-to-reader

Translate the user's plain-language intent into ONE Sendle action. Kindle is the
common case, not the only one — any reader that accepts email works; don't insist
on the word "Kindle".

## Route the intent
| The user wants to… | Do exactly this |
|---|---|
| send a whole file / document ("send this file", a `.md` / `.html` path) | Resolve it to a concrete path, then call `send_file_to_kindle(path)` directly. Pass the **path only** — never read or paste the file (the tool reads it locally; content never passes through the model). One-off; not saved. |
| collect a passage or chat conclusion ("add the summary above", "save this") | Resolve it to the **verbatim text** (never summarize) and its `source` (`user` if the user wrote/pasted it, `ai` if the assistant generated it), then call `collect` directly. It appends to the book being collected, or opens a new one. |
| review or manage the book ("what's in my book", "drop #2", "rename it to X", "list my books") | Invoke the **`sendle:toc`** skill with the request as its argument — e.g. `drop #2`, `rename: X`, `list books`, or nothing to show the contents. |
| send the book ("send it", "ship the book") | Invoke the **`sendle:send`** skill with no argument. It replies with the title and item count; ask the user (AskUserQuestion when available: *Send as-is* / *Rename* / *Cancel*), then invoke `sendle:send` again with `go` or `rename: <new title>`. If the user already gave the final title, go straight to `rename: <title>`. |
| (re)connect Sendle | Call the `authorize` tool. |

`sendle:toc` and `sendle:send` run in the isolated archivist and **cannot see this
conversation** — pass concrete values only (`#N`, an exact title), never "the one
above". Relay their one-line result; keep archiving details out of the main thread.

## Resolve before acting
The user usually **points at** content ("the conclusion above", "that report").
Resolve the pointer yourself first — verbatim text for content, a real path for a
file. If the target is empty or ambiguous, ask once. Never ask "which book": a
collect goes to the book being collected, or opens one.

## Results worth relaying
- A receipt `note` (e.g. "delivered to your inbox because no e-reader is set yet")
  — pass it on verbatim.
- `authorization_required` — relay the link and code verbatim (any device works),
  then retry the same call once the user has approved; the pending login resumes.
- Any other error — relay its message as-is; don't retry on your own.
- **No sendle tools at all** — the plugin's local server isn't running. Which fix applies depends
  on where you are:
  - **Claude Code** (you have a terminal): the server didn't start, almost always because
    Node.js is missing. Tell the user Sendle needs Node.js 22+ on their PATH
    (https://nodejs.org), then `/reload-plugins`.
  - **claude.ai or Cowork** (no terminal): this plugin's local server doesn't run there. Tell
    the user to connect the **Sendle connector** instead (from the directory, or as a custom
    connector at `https://api.sendle.app/mcp`); collecting and sending books then work, while
    sending a local file needs Claude Code.
  Don't try to work around it.
