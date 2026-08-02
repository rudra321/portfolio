// Gated debug logging + a one-command session dump for the chat pipeline.
//
// ON automatically in `npm run dev`; silent for real visitors in a production
// build. To turn it on in a deployed build, run `localStorage.chatDebug = "1"` in
// the browser console (or build with NEXT_PUBLIC_CHAT_DEBUG=1). Browser-only, so
// it never spams the eval/Node.
//
// While testing, open the browser console and run:  chatDump()
// → prints the whole session (every route, retrieval score, which provider
//   answered, and the raw replies) AND copies it to your clipboard to share.

export function chatDebugEnabled(): boolean {
  if (typeof window === "undefined") return false; // skip SSR / eval / node
  if (process.env.NEXT_PUBLIC_CHAT_DEBUG === "1") return true;
  if (process.env.NODE_ENV !== "production") return true; // dev server
  try {
    return window.localStorage?.getItem("chatDebug") === "1";
  } catch {
    return false;
  }
}

const COLORS: Record<string, string> = {
  local: "#E8A87C",
  retrieval: "#7C9CE8",
  resilient: "#8CE8A8",
  proxy: "#E88CD0",
  useChat: "#E8D08C",
  reply: "#B0B0B0",
};

// Ring buffer so the entire session can be dumped even after the console clears.
interface Entry {
  t: number;
  scope: string;
  msg: string;
}
const BUFFER: Entry[] = [];
const MAX_ENTRIES = 800;

function stringify(args: unknown[]): string {
  return args
    .map((a) => {
      if (typeof a === "string") return a;
      if (a instanceof Error) return `${a.name}: ${a.message}`;
      try {
        return JSON.stringify(a);
      } catch {
        return String(a);
      }
    })
    .join(" ")
    .slice(0, 4000);
}

/** Namespaced, colour-tagged console log — a no-op unless debug is enabled. */
export function clog(scope: string, ...args: unknown[]): void {
  if (!chatDebugEnabled()) return;
  BUFFER.push({ t: Date.now(), scope, msg: stringify(args) });
  if (BUFFER.length > MAX_ENTRIES) BUFFER.shift();
  const color = COLORS[scope] ?? "#999";
  // eslint-disable-next-line no-console
  console.log(`%c[chat:${scope}]`, `color:${color};font-weight:700`, ...args);
}

/** A copy-pasteable report of the whole session so far. */
export function dumpChatDebug(): string {
  const endpoint = process.env.NEXT_PUBLIC_CHAT_ENDPOINT;
  const header = [
    "===== CHAT DEBUG DUMP =====",
    `when:     ${new Date().toISOString()}`,
    `provider: ${
      endpoint
        ? `Worker @ ${endpoint}  (LLM tiers via the Worker, local engine as fallback)`
        : "LOCAL ENGINE ONLY — NEXT_PUBLIC_CHAT_ENDPOINT is not set, so you are NOT talking to Gemini/Claude, only the offline fallback."
    }`,
    `entries:  ${BUFFER.length}`,
    "===========================",
    "",
  ].join("\n");
  const t0 = BUFFER[0]?.t ?? Date.now();
  const body = BUFFER.map(
    (e) => `+${((e.t - t0) / 1000).toFixed(1)}s  [${e.scope}]  ${e.msg}`
  ).join("\n");
  return header + body;
}

// Expose `chatDump()` on the window so you can grab a shareable log from the
// browser console with one call (it also copies to your clipboard).
if (typeof window !== "undefined") {
  (window as unknown as { chatDump?: () => string }).chatDump = () => {
    const dump = dumpChatDebug();
    try {
      navigator.clipboard?.writeText(dump);
    } catch {
      // clipboard blocked — the console print below is still selectable
    }
    // eslint-disable-next-line no-console
    console.log(dump);
    // eslint-disable-next-line no-console
    console.log("%c↑ copied to clipboard — paste it to share", "color:#8CE8A8;font-weight:700");
    return dump;
  };
  if (chatDebugEnabled()) {
    // eslint-disable-next-line no-console
    console.log(
      "%c[chat] debug is ON — run chatDump() in this console to copy a shareable log",
      "color:#E8A87C;font-weight:700"
    );
  }
}
