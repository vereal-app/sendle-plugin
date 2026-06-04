// PreToolUse decision policy for the Sendle MCP atoms — single source of truth.
// Both validate.mjs (hook runtime) and test/hook-decide.test.ts import from here, preventing drift.
//
// All sendle atoms are auto-approved (allow) so collecting and sending run with zero interruption.
// Sending to your own Kindle is low-risk and repeatable (a re-send just delivers it again), so there
// is no "ask" confirmation gate. Unknown sendle atoms are denied (defense in depth — e.g. the
// no-longer-exposed write_finished, or a typo); deep argument validation lives in the MCP server (zod).
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
 *   Returns null = not a sendle tool; this hook stays neutral (defers to the default permission flow).
 */
export function decide(toolName) {
  const atom = sendleAtom(toolName);
  if (atom === null) return null;
  if (ALLOW.has(atom)) return { permissionDecision: "allow" };
  return { permissionDecision: "deny", reason: `Unknown sendle atom: ${atom}` };
}
