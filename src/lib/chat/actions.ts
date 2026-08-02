// Back-compat surface. The protocol + parser are the real sources of truth
// (protocol.ts, postprocess.ts); this re-exports them so existing import paths
// keep working.
export type { ChatAction } from "./protocol";
export type { Segment, ParsedReply } from "./postprocess";
export { normalizeReply, normalizeReply as parseActions, actionKey } from "./postprocess";
