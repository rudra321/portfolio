// Tunable limits for the chat. Kept provider-agnostic; each adapter reads what it
// needs. These also act as client-side abuse/cost guards for any keyed provider.

export const CHAT_CONFIG = {
  /** Hard cap on a single user message (characters). */
  maxInputChars: 500,
  /** Only the most recent N messages are sent to the model (keeps cost bounded). */
  maxHistoryMessages: 12,
  /** Soft per-session limit on user turns, enforced client-side. */
  sessionMessageLimit: 20,
  /** Max tokens the model may generate per reply (worker hard cap). */
  maxOutputTokens: 600,
  /** Model + sampling — single knob set; the worker reads these from the body. */
  model: "llama-3.3-70b-versatile",
  temperature: 0.45,
  topP: 0.9,
  frequencyPenalty: 0.3,
} as const;
