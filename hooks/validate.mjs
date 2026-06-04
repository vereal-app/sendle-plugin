// PreToolUse validation gate (Command handler). The matcher is scoped to mcp__sendle__* in hooks.json.
// Reads the PreToolUse payload from stdin → decide() → outputs permissionDecision per the Claude Code hook contract.
import { decide } from "./lib/decide.mjs";

let raw = "";
process.stdin.setEncoding("utf8");
for await (const chunk of process.stdin) raw += chunk;

let payload = {};
try {
  payload = raw ? JSON.parse(raw) : {};
} catch {
  payload = {};
}

const result = decide(payload.tool_name, payload.tool_input);
if (result) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: result.permissionDecision,
        permissionDecisionReason: result.reason ?? "",
      },
    }),
  );
}
process.exit(0);
