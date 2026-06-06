# Sendle — for Claude Code

Archive long-form to your Kindle. In Claude Code, ask in plain words — Sendle assembles a **reproducible** EPUB and delivers it by email.

> This is the **Claude Code plugin**: a thin client for the hosted Sendle service. It is a generated, auditable snapshot — the source of truth lives in a private monorepo, and Codex / Cursor builds live in their own repos. Don't send PRs here; open issues instead.

## Install

```
/plugin marketplace add vereal-app/sendle-plugin
/plugin install sendle
```

When prompted, paste your **access token** — get one free at [sendle.app](https://sendle.app). That's the only thing to configure; the API endpoint is built in.

### One-time Kindle setup

Add Sendle's sender address to your Amazon **Approved Personal Document E-mail List** (Manage Content & Devices → Preferences → Personal Document Settings). Sign-up at [sendle.app](https://sendle.app) walks you through it and sends a test document.

## Use

| Command | What it does |
|---|---|
| `/sendle <text, or "the summary above">` | collect a snippet into the current book |
| `/sendle:toc` | list the current book's items |
| `/sendle:send` | assemble the book → EPUB → send to Kindle |
| `/sendle:kindle <path>` | one-shot: send a local `.md` / `.html` file to Kindle |

Or just ask in plain words — *"send this RFC to my Kindle with sendle"*.

## How it works

- **Remote MCP** (`sendle`, HTTP + your token) → the hosted kernel: store, assemble a reproducible EPUB, deliver by email.
- **Local shell** (`sendle-local`, stdio) → one tool, `send_file_to_kindle`: reads a local file and uploads it — the content never passes through the model.

"Kindle" is just the common case: any reader that accepts email works, or your own inbox.

## Privacy

- **Zero tokens, zero model exposure** — local files are read on your machine and uploaded straight to Sendle; their contents never enter the model context.
- **One-shot sends aren't stored** — files and pastes are built into an EPUB, delivered, and discarded. Only a delivery record (title, kind, timestamp) is kept for your send history and plan limits.
- **Your books, your call** — collected books are kept so you can manage and re-send them, and hard-deleted the moment you delete them.

Full policy: [sendle.app/privacy](https://sendle.app/privacy)

## Links

- Web app & sign-up — https://sendle.app

## License

MIT © VEREAL
