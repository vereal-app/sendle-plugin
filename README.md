# Sendle — for Claude Code

Archive long-form to your Kindle. In Claude Code, ask in plain words — Sendle assembles a **reproducible** EPUB and delivers it by email.

**See the result first:** [download a sample book](https://sendle.app/sendle-sample.epub) (11 KB EPUB) — real chapters, a contents page, code that survives e-ink, assembled by the same pipeline this plugin drives. More live examples: [sendle.app/examples](https://sendle.app/examples?ref=github).

> This is the **Claude Code plugin**: a thin client for the hosted Sendle service. It is a generated, auditable snapshot — the source of truth lives in a private monorepo, and Codex / Cursor builds live in their own repos. Don't send PRs here; open issues instead.

## Install

```
/plugin marketplace add vereal-app/sendle-plugin
/plugin install sendle
```

If Claude Code says so, run `/reload-plugins` to activate it without a restart.

That's it. **There's nothing to configure and no token to paste.** The first time you ask for something, a browser opens. Sign in to [sendle.app](https://sendle.app/?ref=github) (free) and approve once, and the request you made completes. **No e-reader set up yet?** Sends go to your login inbox until you add a Kindle or e-reader address at [sendle.app/app](https://sendle.app/app?ref=github).

Requires **Node.js 22+ on your PATH**. The plugin's local server and hooks run on `node`, and Claude Code itself doesn't ship one.

**Using Claude Cowork?** Cowork can't run local plugin servers. Add `https://api.sendle.app/mcp` as a custom connector instead. Collecting from chat and sending books work the same, but sending a local file needs Claude Code.

**On a remote server / no browser?** Still works. You get a short code and an `api.sendle.app/activate` link. Open it on your phone or laptop, approve, and confirm in the terminal. Ask Claude to "reconnect Sendle" any time to check or repair the login.

### Delivering to a Kindle

Add your Kindle address at [sendle.app/app](https://sendle.app/app?ref=github), then add Sendle's sender address to your Amazon **Approved Personal Document E-mail List** (Manage Content & Devices → Preferences → Personal Document Settings). The page shows the exact address and sends a test document. Using Gmail? You can deliver from your own address instead. If that is also your Amazon login email, Amazon usually needs nothing.

## Use

Just say it in plain words, in any language:

- *"send notes.md to my Kindle"* builds an EPUB from a local file and emails it. It's one-off and not saved.
- *"add the summary above to sendle"* collects a passage into your book. The first collect opens a book.
- *"what's in my book?"* and *"drop #2"* review and trim it.
- *"send the book"* confirms the title, then emails the assembled book.

Prefer commands? The same actions are `/sendle:kindle <file>`, `/sendle:collect <text>`, `/sendle:toc`, `/sendle:send` and `/sendle:help`.

### Bundled skill: single-html

The plugin ships a report skill: ask for a write-up (*"turn this into a report"*) and Claude produces **one self-contained HTML file** — fixed table of contents, callouts, tables, readable offline. Sendle's EPUB engine is tuned for exactly that format, so the same file reads clean on e-ink: `/sendle:kindle docs/your-report.html` and it's on your Kindle.

## How it works

One local MCP server, `sendle`, does two jobs:

- **Sends local files.** `send_file_to_kindle` reads the file on your machine and uploads it. The content never passes through the model.
- **Forwards book operations.** Collect, contents, rename and send go to the hosted Sendle service, which stores your book, assembles a reproducible EPUB and delivers it by email. It uses the same one-time login.

Book review and sending run in an isolated `archivist` subagent, so your main conversation only sees a one-line result.

"Kindle" is just the common case: any reader that accepts email works, or your own inbox.

## Permissions and data

Everything this plugin runs, reads, writes and sends:

**Hooks** run on your machine and never touch the network.

- `PreToolUse` runs only on calls to Sendle's own MCP tools. It **auto-approves Sendle's known tools**, so collecting and sending don't stop for a permission prompt each time. It never approves any other tool. It **blocks `send_book` outside the `sendle:archivist` subagent**, so a book is only sent after the title is confirmed. Any Sendle tool it doesn't recognize falls back to Claude Code's normal permission prompt.
- `SessionStart` runs once per new session. It writes a first-run `welcomed` flag, and a timestamp that limits a re-login reminder to once a day, in the plugin's data directory. It reads `~/.config/sendle/credentials.json` only to check whether your login has expired. It then adds a one-line note to Claude's context.

**The MCP server** is a single local process, `node dist/local.mjs`. It only talks to `https://api.sendle.app`.

- `send_file_to_kindle` reads **only the file whose path you ask it to send**. It uploads that file's text to `/v1/ephemeral-send`, where Sendle builds the EPUB, emails it to your reader and discards it. The text never enters the model context.
- The book tools (`collect`, `render_toc`, `send_book` and the rest) forward their arguments to `/mcp`. A passage you collect is sent to Sendle and stored in your book until you delete it.
- **Login** happens once. It opens your browser at `api.sendle.app/authorize`, using a one-time listener on `127.0.0.1` to receive the redirect. On a headless machine you get a code to approve at `api.sendle.app/activate` instead. Your credentials are stored in `~/.config/sendle/credentials.json` (file mode 600), and a login in progress is kept in `~/.config/sendle/device.json`. Access tokens refresh silently. Asking Claude to "switch my Sendle account" deletes both files and signs in again.
- The plugin itself sends **no telemetry or analytics**.
- `dist/local.mjs` is an unminified esbuild bundle. It contains Sendle's local server plus the open-source MCP TypeScript SDK and zod.

**Skills and the agent** are plain instructions. The `archivist` subagent can only call Sendle's book tools. It has no shell or file access.

## Privacy

- **Zero tokens, zero model exposure** — local files are read on your machine and uploaded straight to Sendle; their contents never enter the model context.
- **One-shot sends aren't stored** — files are built into an EPUB, delivered, and discarded. Only a delivery record (title, kind, timestamp) is kept for your send history and plan limits.
- **Your books, your call** — collected books are kept so you can manage and re-send them, and hard-deleted the moment you delete them.

Full policy: [sendle.app/privacy](https://sendle.app/privacy)

## Links

- Web app & sign-up — https://sendle.app/?ref=github
- Examples & sample EPUB — https://sendle.app/examples?ref=github
- Guides (every way to send) — https://sendle.app/guides?ref=github
- Pricing (free tier: 7 books/month) — https://sendle.app/pricing?ref=github
- Privacy — https://sendle.app/privacy

## License

[Apache-2.0](LICENSE) © VEREAL Labs — free to use, modify, and distribute.
