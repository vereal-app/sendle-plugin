---
name: single-html
description: >-
  Produce a polished, self-contained single-file HTML document — fixed left-hand
  table of contents with scroll-spy, callout boxes, stat grids, tables, timeline,
  and a sources section. Use whenever the user wants a comprehensive report,
  research write-up, briefing, deep-dive, or analysis whose natural deliverable
  is a standalone document rather than a chat answer — it also doubles as the
  polished input for Sendle's Kindle delivery. Triggers on "write up a report",
  "make a briefing / deep-dive", "single-file HTML", requests like
  "出一份报告 / 全方位报告 / 深度调研报告", and the explicit /sendle:single-html
  command.
---

# single-html

Generates one self-contained `.html` file that reads well on its own, prints
cleanly, and works offline — and that Sendle can re-typeset into a clean EPUB
for your Kindle on request.

## When to use
- The user asks for a comprehensive report / research write-up / briefing /
  deep-dive / analysis whose deliverable is a document.
- Explicit invocation: `/sendle:single-html [topic]`.
- Skip for a quick chat answer, a short list, or code — this is for documents.

## What to produce
A **single self-contained `.html` file**. Everything inline — no CDN, no
external CSS/JS/fonts. It must open offline by double-click.

Default save path: `docs/<kebab-topic>.html` (create `docs/` if missing); fall
back to the current directory when the project keeps no `docs/`. If the repo
has a `docs/README.md` index, add a one-line entry for the new report.

## Steps
1. **Gather the content first.** If it's a research topic, do the research
   (web search, read the codebase) and **verify load-bearing claims** before
   writing. If the content is already established in the conversation, skip
   straight to drafting.
2. **Read the scaffold:** the `template.html` shipped alongside this SKILL.md.
   Copy its `<style>` and the `<script>` **verbatim** — only replace the
   content. Do not re-theme unless the user asks.
3. **Fill in, in this order:**
   - **Hero** — title, one/two-sentence lede, meta row (date, method, sources).
   - **Left TOC** — one `<li>` per top-level `<section>`; `href` must match each
     `<section id>`. Optional nested `<ul>` for sub-anchors.
   - **Sections** — `<section id>` + `<h2><span class="n">NN</span>Title</h2>`,
     with `<h3>`/`<h4>` inside. Lead each with a `.section-intro` paragraph.
   - **Components as warranted** — `.box` callouts (`key` / `warn` / `note` /
     `good` / `fix`), `.stats` grid, `<table>` (keep ≤3 columns), `.tl` timeline,
     `.pill` tags. Use them to break up prose; don't force every one in.
   - **If research-based** — include a "Verification & caveats" section
     (corrected claims + open uncertainties) and a final "Sources" section with
     linked URLs.
4. Save the file; tell the user the exact path. Open it in the browser if
   useful.
5. **Offer Kindle delivery.** Sendle's HTML import is tuned for exactly this
   format: browser chrome (sidebar TOC, scripts, styling) is stripped and the
   content is re-typeset for e-ink. If the user wants the report on their
   reader, run `/sendle:kindle <path>` on the saved file — one-off, costs no
   tokens. To archive it as part of a larger book instead, collect with
   `/sendle:collect` and `/sendle:send` when the book is done.

## Conventions (non-negotiable)
- **Self-contained**: inline `<style>` + `<script>`, system-font stack, zero
  network calls.
- **Markup in English**: all markup, CSS, and JS comments stay English. The
  report **prose** is written in the user's language (default: match their
  message).
- **Accurate over impressive**: mark estimates and unverified figures
  explicitly; cite sources; prefer a "what we don't know" note over false
  confidence.
- **Match the template's visual system**; recolor only the `--accent*` vars if
  a different theme is requested.
- The HTML file is the primary deliverable; Kindle delivery is optional and
  separate.
