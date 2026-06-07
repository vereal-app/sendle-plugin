# Sendle — for Claude Code

Archive long-form to your Kindle. In Claude Code, ask in plain words — Sendle assembles a **reproducible** EPUB and delivers it by email.

**See the result first:** [download a sample book](https://sendle.app/sendle-sample.epub) (11 KB EPUB) — real chapters, a contents page, code that survives e-ink, assembled by the same pipeline this plugin drives. More live examples: [sendle.app/examples](https://sendle.app/examples?ref=github).

> This is the **Claude Code plugin**: a thin client for the hosted Sendle service. It is a generated, auditable snapshot — the source of truth lives in a private monorepo, and Codex / Cursor builds live in their own repos. Don't send PRs here; open issues instead.

## Install

```
/plugin marketplace add vereal-app/sendle-plugin
/plugin install sendle
/reload-plugins
```

When prompted, paste your **access token** — get one free at [sendle.app](https://sendle.app/?ref=github). That's the only thing to configure; the API endpoint is built in. The final `/reload-plugins` restarts the plugin's connectors so they pick up your token.

### One-time Kindle setup

Add Sendle's sender address to your Amazon **Approved Personal Document E-mail List** (Manage Content & Devices → Preferences → Personal Document Settings). Sign-up at [sendle.app](https://sendle.app/?ref=github) walks you through it and sends a test document.

## Use

| Command | What it does |
|---|---|
| `/sendle <text, or "the summary above">` | collect a snippet into the current book |
| `/sendle:toc` | list the current book's items |
| `/sendle:send` | assemble the book → EPUB → send to Kindle |
| `/sendle:kindle <path>` | one-shot: send a local `.md` / `.html` file to Kindle |
| `/sendle:single-html <topic>` | write a polished single-file HTML report — then offer to Kindle it |

Or just ask in plain words — *"send this RFC to my Kindle with sendle"*.

### Bundled skill: single-html

The plugin ships a report skill: ask for a write-up (*"turn this into a report"*) and Claude produces **one self-contained HTML file** — fixed table of contents, callouts, tables, readable offline. Sendle's EPUB engine is tuned for exactly that format, so the same file reads clean on e-ink: `/sendle:kindle docs/your-report.html` and it's on your Kindle.

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

- Web app & sign-up — https://sendle.app/?ref=github
- Examples & sample EPUB — https://sendle.app/examples?ref=github
- Guides (every way to send) — https://sendle.app/guides?ref=github
- Pricing (free tier: 5 books/month) — https://sendle.app/pricing?ref=github
- Privacy — https://sendle.app/privacy

## License

MIT © VEREAL
