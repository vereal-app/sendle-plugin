// PreToolUse decision policy for the Sendle MCP atoms — single source of truth.
// Both validate.mjs (hook runtime) and test/hook-decide.test.ts import from here, preventing drift.
//
// Known sendle atoms are auto-approved (allow) so collecting and sending run with zero interruption.
// Sending to your own Kindle is low-risk and repeatable (a re-send just delivers it again), so there
// is no "ask" confirmation gate; deep argument validation lives in the MCP server (zod).
// Unknown sendle atoms get NEUTRAL (null → Claude Code's default permission flow, i.e. a prompt),
// not a hard deny: the hosted server ships new tools faster than installed plugins update, and a
// deny would dead-end every new remote tool until the plugin caught up. Neutral keeps the defense
// (nothing unknown is silently auto-approved) without coupling server releases to plugin releases.
//
// One atom is caller-gated: send_book runs only inside the archivist subagent. The hook payload
// carries agent_type ONLY when the call comes from a subagent (plugin agents report
// "<plugin>:<name>", e.g. "sendle:archivist"; absent = the main thread, per the hooks docs) —
// so "not the archivist" is a positive identification, and the deny reason redirects the model
// to delegate. Everything else stays caller-agnostic: collect / send_file_to_kindle are the
// sanctioned main-thread one-shots, and the read/manage atoms are harmless anywhere.
import { sendleAtom } from "./tool-name.mjs";

const ALLOW = new Set([
  "list_books",
  "create_book",
  "rename_book",
  "read_raw",
  "render_toc",
  "append_raw",
  "discard_raw",
  "set_status",
  "send_book",
  "send_file_to_kindle",
  "collect",
  "authorize",
]);

// Matches the plugin-scoped ("sendle:archivist") and bare ("archivist", unpackaged dev) forms.
const ARCHIVIST = /(^|:)archivist$/;

/**
 * @param {string} toolName
 * @param {string} [agentType] the hook payload's agent_type: set inside subagents, absent on the main thread
 * @returns {{ permissionDecision: "allow" | "deny", reason?: string } | null}
 *   Returns null = no stance (not a sendle tool, or an atom this plugin version doesn't know);
 *   the hook stays neutral and Claude Code's default permission flow decides.
 */
export function decide(toolName, agentType) {
  const atom = sendleAtom(toolName);
  if (atom === null) return null;
  if (atom === "send_book" && !ARCHIVIST.test(agentType ?? "")) {
    return {
      permissionDecision: "deny",
      reason:
        "send_book runs only inside the sendle:archivist subagent. Delegate with the Task tool (subagent_type: sendle:archivist), as /sendle:send does — the archivist confirms the title, then sends.",
    };
  }
  if (ALLOW.has(atom)) return { permissionDecision: "allow" };
  return null;
}
