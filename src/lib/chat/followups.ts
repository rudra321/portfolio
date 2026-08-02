import type { ChatAction } from "./protocol";

// Curated follow-up fallback — the deterministic floor when the model doesn't
// emit its own [[next:…]]. Keyed off the card the turn rendered. Filtered against
// questions already asked this thread.
export function followupsFor(actions: ChatAction[], asked: Set<string>): string[] {
  const last = actions[actions.length - 1]?.type;
  let pool: string[];
  switch (last) {
    case "projects":
    case "project":
      pool = ["How did you handle payments at scale?", "What was the hardest part?", "Are you open to work?"];
      break;
    case "skills":
      pool = ["Do you know Rust?", "What are you weakest at?", "What's your main stack?"];
      break;
    case "experience":
      pool = ["What's the hardest thing you built at Raaz?", "Why healthcare?", "Are you open to work?"];
      break;
    case "contact":
    case "resume":
      pool = [];
      break;
    default:
      pool = ["What's the most impressive thing you've built?", "What are you best at?", "Are you open to work?"];
  }
  return pool.filter((q) => !asked.has(q.toLowerCase())).slice(0, 3);
}
