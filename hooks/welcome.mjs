// SessionStart welcome (run-once). The first time Sendle runs after install, inject a
// short first-run note via additionalContext so Claude greets the user with a quickstart.
// SessionStart stdout is added to Claude's context (not shown to the user directly), so we
// hand Claude the note instead of printing a banner. State lives in CLAUDE_PLUGIN_DATA so
// it survives plugin updates; the welcome shows once.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const stateDir = process.env.CLAUDE_PLUGIN_DATA || join(homedir(), ".claude", "sendle");
const flag = join(stateDir, "welcomed");

// Already welcomed → stay silent.
if (existsSync(flag)) process.exit(0);

// Record it first; if persistence fails we still greet once (best-effort).
try {
  mkdirSync(stateDir, { recursive: true });
  writeFileSync(flag, `${new Date().toISOString()}\n`);
} catch {
  // best-effort: persisting the flag is optional
}

const additionalContext = [
  "This is the user's first Claude Code session since the Sendle plugin was installed.",
  "Unless it would derail their first request, give them a short (~2-line) welcome, then continue normally — do not repeat this in later turns.",
  "Sendle archives long-form reading to a Kindle — or any e-reader or inbox that accepts email — as a clean EPUB.",
  "On first use the plugin opens a browser to authorize; there's no token to paste.",
  'To use it they can just say things like "send this to my reader" or "kindle this file", or run /sendle:help.',
].join(" ");

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext,
    },
  }),
);
process.exit(0);
