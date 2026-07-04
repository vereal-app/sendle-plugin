// SessionStart context injection: a run-once welcome after install, plus a proactive
// re-authorization nudge when the cached credential is expired beyond silent repair.
// SessionStart stdout is added to Claude's context (not shown to the user directly), so we hand
// Claude notes instead of printing banners. All checks are LOCAL file reads — a SessionStart hook
// must never touch the network. State lives in CLAUDE_PLUGIN_DATA so it survives plugin updates.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const stateDir = process.env.CLAUDE_PLUGIN_DATA || join(homedir(), ".claude", "sendle");
const API_BASE = "https://api.sendle.app";
const NUDGE_THROTTLE_MS = 24 * 60 * 60 * 1000;

function markState(file, value) {
  try {
    mkdirSync(stateDir, { recursive: true });
    writeFileSync(join(stateDir, file), `${value}\n`);
  } catch {
    // best-effort: persisting state is optional
  }
}

// Run-once welcome (kept from v0.1): greet on the first session after install.
function welcomeNote() {
  if (existsSync(join(stateDir, "welcomed"))) return null;
  markState("welcomed", new Date().toISOString());
  return [
    "This is the user's first Claude Code session since the Sendle plugin was installed.",
    "Unless it would derail their first request, give them a short (~2-line) welcome, then continue normally — do not repeat this in later turns.",
    "Sendle archives long-form reading to a Kindle — or any e-reader or inbox that accepts email — as a clean EPUB.",
    "On first use the plugin asks for a one-time authorization (a browser pops on desktops; headless machines get a link + code to open on any device); there's no token to paste.",
    'To use it they can just say things like "send this to my reader" or "kindle this file", or run /sendle:help.',
  ].join(" ");
}

// Proactive re-auth nudge: the cached credential exists (they authorized before) but the access
// token is expired AND there is no refresh token — the next send would stop for a full login.
// Throttled to once a day so a broken week isn't a nagging week.
function reauthNote() {
  let creds;
  try {
    creds = JSON.parse(
      readFileSync(join(homedir(), ".config", "sendle", "credentials.json"), "utf8"),
    )[API_BASE];
  } catch {
    return null; // never authorized here (or unreadable) — the welcome/first-use flow covers it
  }
  if (!creds || creds.refreshToken || creds.expiresAt > Date.now()) return null;

  const throttleFile = join(stateDir, "reauth-nudged");
  try {
    const last = Date.parse(readFileSync(throttleFile, "utf8").trim());
    if (Number.isFinite(last) && Date.now() - last < NUDGE_THROTTLE_MS) return null;
  } catch {
    // no throttle record yet
  }
  markState("reauth-nudged", new Date().toISOString());
  return [
    "Sendle note: this machine's Sendle authorization has expired and cannot refresh silently, so the next send would stop for a login.",
    "If (and only if) the user touches on sending things to their reader — or asks about Sendle — offer to reconnect first: call the sendle-local `authorize` tool.",
    "On a browserless machine it returns a link + code they can approve from any device. Do not interrupt unrelated work with this.",
  ].join(" ");
}

const notes = [welcomeNote(), reauthNote()].filter(Boolean);
if (notes.length > 0) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "SessionStart",
        additionalContext: notes.join(" "),
      },
    }),
  );
}
process.exit(0);
