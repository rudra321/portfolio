# portfolio-chat worker

A small Cloudflare Worker that is the chat's **server-side failover chain**. It
holds the API keys (as secrets, never in the frontend bundle) and tries the
configured providers in order, normalizing whichever answers to one SSE shape:

| Tier | Provider | Secret | Notes |
|------|----------|--------|-------|
| — | Google **Gemini Flash** | `GEMINI_API_KEY` | **Recommended free setup.** Generous free tier — no daily cliff. Get a key at [aistudio.google.com](https://aistudio.google.com/apikey). |
| — | **Groq** Llama 3.3 70B | `GROQ_API_KEY` | Free, but a small daily token cap — best as a *fallback*, not primary. |
| — | Anthropic Claude **Haiku 4.5** | `ANTHROPIC_API_KEY` | Optional, paid, best quality; system prompt is prompt-cached so repeat cost ≈ 0. Set a spend cap. |

All are optional. The Worker uses whichever secrets are set, in `PROVIDER_ORDER`
(default `anthropic,gemini,groq`) — it silently skips any provider whose key is
absent, so **no Anthropic key means it just starts at Gemini**. If the Worker is
unreachable or every provider is rate-limited, the **browser** falls back to its
in-app local engine (`src/lib/chat/providers/local.ts`) — so the chat keeps
answering with zero network. The chat cannot "run out of tokens."

> **Fully local option:** set *no* keys at all (or don't deploy the Worker and
> leave `NEXT_PUBLIC_CHAT_ENDPOINT` unset). The chat then runs 100% in-browser on
> the local retrieval engine — free forever, works offline, more on-rails.

## Deploy (one time — free, no Anthropic)

```bash
npm i -g wrangler          # if you don't have it
cd worker
wrangler login             # opens the browser
wrangler secret put GEMINI_API_KEY   # free key from aistudio.google.com
# optional extra free fallback:  wrangler secret put GROQ_API_KEY
wrangler deploy
```

`wrangler deploy` prints a URL like `https://portfolio-chat.<you>.workers.dev`.

## Point the site at it

Set that URL as `NEXT_PUBLIC_CHAT_ENDPOINT`:

- **Local dev:** add to `.env.local`
- **Production (GitHub Pages):** add a repo secret `CHAT_ENDPOINT` (the deploy
  workflow already injects it at build).

With the endpoint set, the site uses the live failover chain; without it, the
site runs on the local engine alone (still fully usable, just more on-rails).

## Verify

```bash
curl -N -X POST https://portfolio-chat.<you>.workers.dev \
  -H 'content-type: application/json' \
  -d '{"messages":[{"role":"system","content":"You are Rudra."},{"role":"user","content":"hi"}]}'
# → streams `data: {"choices":[{"delta":{"content":"..."}}]}` … `data: [DONE]`
# The `x-provider` response header tells you which tier answered.
```
