# Portfolio

Personal portfolio for Rudra Pratap Singh Chouhan — a single-page, statically
exported site built with the Next.js App Router and deployed to GitHub Pages.

## Stack

- **Next.js 16** (App Router, `output: "export"` — fully static)
- **React 19** + **TypeScript**
- **Tailwind CSS v4** (CSS-first; tokens live in `src/app/globals.css`, no config file)
- **Framer Motion** — all reveal/mount animations and the custom cursor
- **Lenis** — smooth scroll inertia
- **lucide-react** — icons

## Project layout

```
src/
  app/            layout, page, global styles, generated OG image
  components/
    ai/           ChatExperience · GenerativeBlocks (cards) · useChat
    sections/     About · Experience · Projects · Skills · Contact (crawlable fallback)
    ui/           reusable primitives (GradientBlob, TiltCard, CopyEmail, …)
    layout/       Navbar · Footer · ScrollProgress
    providers/    LenisProvider
  hooks/          media query, reduced motion, tilt
  lib/
    chat/         provider-agnostic chat core
      providers/  proxy (Worker) · local (in-browser RAG) · resilient (failover)
      eval/       offline eval harness + cases
    animations, constants
  data/           typed content (personal, projects, experience, skills, stats)
```

All content is typed data in `src/data/` and inlined at build time — the chat's
knowledge base and the page sections read from the same source, so they never
drift.

## AI chat — the front door

The portfolio **is** a conversation. The chat (`src/components/ai`) is the primary
interface; the scroll sections below it are a crawlable, no-JS fallback. Answers
are grounded in the same `src/data/*` content — no second knowledge source.

It's built for **absolute reliability** via a failover chain, so a visitor never
sees "couldn't reach the AI". The Worker tries whichever providers you've given
keys, in order, and silently skips the rest:

1. **Gemini Flash** — recommended **free** primary (generous free tier, no daily
   cliff). Or **Claude Haiku 4.5** for best quality (paid, prompt-cached so repeat
   cost ≈ 0). Or **Groq** as a free fallback.
2. **Local engine** (`src/lib/chat/providers/local.ts`) — in-browser RAG-lite
   (`src/lib/chat/retrieval.ts`) that retrieves from `src/data/*` and composes a
   grounded answer in the same card grammar with **zero API calls**.

The client wraps the Worker and the local engine in `resilientProvider`: if the
Worker is unreachable or every provider is rate-limited, it transparently drops to
the local engine. The chat cannot "run out of tokens." With **no keys at all** it
runs entirely on the local engine — free forever, works offline.

- **Provider-agnostic core** in `src/lib/chat` behind one `ChatProvider` interface;
  the live chain is chosen in `src/lib/chat/index.ts`.
- **Marker protocol** (`src/lib/chat/protocol.ts`): the model emits `[[ui:…]]`
  cards + a `[[next:…]]` follow-up line, validated against the live data so a card
  can never reference an id that doesn't exist.
- **Eval harness** in `src/lib/chat/eval` (`npm run eval`) scores responses on
  grounding, voice, concision, and boundary behavior.

### Going live

No API key is required — the site ships working on the local engine alone. For a
**free, real-LLM** chat, deploy the Worker (see [`worker/`](worker/README.md))
with a free `GEMINI_API_KEY` (no Anthropic needed), then set the Worker URL as the
`CHAT_ENDPOINT` GitHub Actions secret (injected at build as
`NEXT_PUBLIC_CHAT_ENDPOINT`). Keys live in the Worker as secrets — never in the
public bundle. Add `ANTHROPIC_API_KEY` later only if you want Claude-tier quality.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
npm run lint
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which runs the static
export and publishes `./out` to GitHub Pages. The site is served under the
`/portfolio` base path (configured in `next.config.ts`).
