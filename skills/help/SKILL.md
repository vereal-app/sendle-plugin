---
name: help
description: "What Sendle can do — plain words work too."
argument-hint: "[or just say what you want]"
disable-model-invocation: true
---

The user's request after `/sendle:help`: $ARGUMENTS

**If it is empty**, output this help block verbatim and stop — do not call any tool:

> **Sendle** — put long-form reading on your Kindle (or any e-reader that takes email). Just say it in plain words:
>
> - "send `notes.md` to my Kindle" — builds an EPUB from a file and emails it (one-off, not saved)
> - "add the summary above to sendle" — collects a passage into your book (the first one opens a book)
> - "what's in my book?" · "drop #2" — review and trim it
> - "send the book" — emails the assembled book
>
> The same actions exist as commands if you prefer: `/sendle:kindle <file>` · `/sendle:collect <text>` · `/sendle:toc` · `/sendle:send`.
> No e-reader set up yet? Sends go to your login inbox until you add one at sendle.app/app.

**Otherwise** treat it exactly as if the user had said it in plain words, and act on it.
