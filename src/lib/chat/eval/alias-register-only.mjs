// Registers ONLY the @/ alias resolver (no tsx import). Used when tsx itself is
// already the runtime (e.g. invoked via the `tsx` binary), so we just add our
// resolver to the existing loader chain.

import { register } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const hookUrl = pathToFileURL(resolve(here, "alias-hook.mjs")).href;
register(hookUrl);
