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
]);

/**
 * @param {string} toolName
 * @returns {{ permissionDecision: "allow" | "deny", reason?: string } | null}
 *   Returns null = no stance (not a sendle tool, or an atom this plugin version doesn't know);
 *   the hook stays neutral and Claude Code's default permission flow decides.
 */
export function decide(toolName) {
  const atom = sendleAtom(toolName);
  if (atom === null) return null;
  if (ALLOW.has(atom)) return { permissionDecision: "allow" };
  return null;
}
