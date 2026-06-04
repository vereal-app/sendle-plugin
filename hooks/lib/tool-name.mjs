// Resolve a Sendle MCP atom from a tool name, regardless of how the server is surfaced:
//   standalone server      -> "mcp__sendle__<atom>"
//   installed as a plugin   -> "mcp__plugin_sendle_sendle__<atom>"
//     (Claude Code namespaces a plugin's MCP server as `mcp__plugin_<plugin>_<server>__`).
// Also matches the local shell server "sendle-local" (mcp__plugin_sendle_sendle-local__<atom>),
// which carries send_file_to_kindle. Single source of truth so hook matching never drifts.
const ATOM = /^mcp__(?:plugin_sendle_)?sendle(?:-local)?__(.+)$/;

/**
 * @param {unknown} toolName
 * @returns {string | null} the atom (e.g. "list_books"), or null if not a Sendle tool.
 */
export function sendleAtom(toolName) {
  if (typeof toolName !== "string") return null;
  const m = ATOM.exec(toolName);
  return m ? m[1] : null;
}
