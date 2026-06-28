---
description: "What Sendle can do, and how — archive long-form to your Kindle or any e-reader that takes email. Plain words work too, e.g. /sendle:help send the summary above"
argument-hint: "[or just say what you want]"
---

The user's intent: $ARGUMENTS

**If that intent is empty or only whitespace** (the user typed `/sendle:help` with no arguments), output the help block below verbatim and STOP — do not delegate, do not call any tool:

> **Sendle** — archive long-form to your Kindle (or any e-reader that takes email), two ways:
>
> **① Send a file** — `/sendle:kindle <a .md/.html path, or a file mentioned above>` (builds an EPUB and emails it; one-off, not saved)
> **② Collect, then send a book** — `/sendle:collect <text, or just say what to grab — e.g. "the summary above">` stashes snippets (the first one opens a book) · `/sendle:toc` reviews them (drop any by its `#N`) · `/sendle:send` emails the assembled book
>
> Or just **say it in plain words** and I'll do it — "send this file to my Kindle", "add the summary above to sendle", "what's in my book", "send it". You don't have to remember the commands.

**Otherwise**, delegate the intent — together with its **concrete content** — in full to the **archivist** subagent (use the Task tool with subagent_type set to `sendle:archivist`). You (the main thread) must **not** call any `mcp__sendle__*` tools yourself, and must not get into archiving details — do a single delegation and return the subagent's one-line summary.

Delegation notes:
- The user may **point at** something instead of spelling it out — chat content ("the conclusion above") or a file ("that doc"). Resolve it to a **concrete value** first: verbatim text for content (never summarize), a real/absolute path for a file. Pass concrete values only, never references.
- For the buffer flow the active book is the one that's *collecting*; if none is, a collect opens one — don't ask "which book".

<!-- sendle-archive-request -->
