// ── @/ alias resolver for Node/tsx ───────────────────────────────────────────
// The PRODUCTION chat modules import `@/data/*` and `@/lib/...`. tsx transpiles
// TS but does NOT read tsconfig `paths`, so `@/` would fail to resolve at
// runtime. This ESM resolver hook (registered via `node --import`, chained AFTER
// tsx's own loader) rewrites any specifier starting with `@/` to an absolute
// file URL under <repo>/src/, then lets the next loader (tsx) handle the actual
// TS transpile + extension resolution.
//
// The eval engine's OWN files use relative imports; this hook exists solely so
// the reused production files resolve unmodified.

import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve as resolvePath } from "node:path";

// This file lives at <repo>/src/lib/chat/eval/alias-hook.mjs → src is 3 dirs up.
const HERE = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = resolvePath(HERE, "..", "..", "..", ".."); // → <repo>/src

export async function resolve(specifier, context, nextResolve) {
  if (specifier === "@" || specifier.startsWith("@/")) {
    const rel = specifier === "@" ? "" : specifier.slice(2); // strip "@/"
    const target = resolvePath(SRC_DIR, rel);
    const url = pathToFileURL(target).href;
    // Hand the rewritten specifier back through the chain so tsx can add the
    // ".ts" extension and transpile it.
    return nextResolve(url, context);
  }
  return nextResolve(specifier, context);
}
