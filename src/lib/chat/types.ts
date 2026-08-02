// Provider-agnostic chat contracts. Everything in src/lib/chat depends on these,
// never on a concrete provider — swap providers by changing src/lib/chat/index.ts.

export type ChatRole = "user" | "model";

export interface ChatMessage {
  /** Stable id for React keys + framer enter/exit (UI messages always set it). */
  id?: string;
  role: ChatRole;
  content: string;
}

export interface ChatProvider {
  /** Stable id, useful for debugging / telemetry. */
  readonly id: string;
  /**
   * Stream a reply for the given conversation. Implementations must:
   *  - yield text deltas (not the full message each time)
   *  - stop promptly when `signal` is aborted
   *  - throw on transport/HTTP errors so the UI can surface them
   */
  streamReply(messages: ChatMessage[], signal: AbortSignal): AsyncIterable<string>;
}
