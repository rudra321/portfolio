"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, ArrowDown, Square, Plus, RotateCw } from "lucide-react";
import { useChat } from "./useChat";
import { GenerativeBlock } from "./GenerativeBlocks";
import { normalizeReply, actionKey } from "@/lib/chat/postprocess";
import { followupsFor } from "@/lib/chat/followups";
import { STARTERS } from "@/lib/chat/canned";
import { CHAT_CONFIG } from "@/lib/chat/config";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import { GradientBlob } from "@/components/ui/GradientBlob";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PERSONAL } from "@/data/personal";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// The conversation IS the front door. The traditional sections live below as a
// crawlable, accessible fallback, reached through the labeled seam in page.tsx.
export function ChatExperience() {
  const { messages, status, announce, limitReached, send, stop, retry, reset, addExchange } =
    useChat();
  const [draft, setDraft] = useState("");
  const [atBottom, setAtBottom] = useState(true);
  const reduced = useReducedMotion();

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  const started = messages.length > 0;
  const streaming = status === "streaming";

  // Follow-up chips after an idle model turn: prefer the model's own [[next:]],
  // fall back to a curated set, minus anything already asked this thread.
  const lastMsg = messages[messages.length - 1];
  const followups: string[] = (() => {
    if (!started || status !== "idle" || limitReached || lastMsg?.role !== "model") return [];
    const parsed = normalizeReply(lastMsg.content);
    const asked = new Set(messages.filter((m) => m.role === "user").map((m) => m.content.toLowerCase()));
    const fromModel = parsed.next.filter((q) => !asked.has(q.toLowerCase()));
    return (fromModel.length ? fromModel : followupsFor(parsed.actions, asked)).slice(0, 3);
  })();

  // Auto-scroll only when the user is already near the bottom (don't yank them).
  useEffect(() => {
    if (!atBottom) return;
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, atBottom]);

  const onThreadScroll = () => {
    const el = threadRef.current;
    if (el) setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 80);
  };

  const jumpToLatest = () => {
    const el = threadRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  };

  const submit = (text: string) => {
    if (!text.trim() || limitReached) return;
    setAtBottom(true);
    send(text);
    setDraft("");
    inputRef.current?.focus();
  };

  // On touch, keep the input above the on-screen keyboard.
  const handleFocus = () => {
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      setTimeout(() => inputRef.current?.scrollIntoView({ block: "center", behavior: "smooth" }), 300);
    }
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 py-24 max-md:justify-start max-md:pt-32"
    >
      <GradientBlob color="ember" size="540px" className="-top-60 right-[-10%] opacity-40" />
      <GradientBlob color="purple" size="360px" className="bottom-[4%] left-[-8%] opacity-25" />

      <div className="relative z-10 mx-auto w-full max-w-2xl">
        <AnimatePresence mode="wait" initial={false}>
          {!started ? (
            /* ---------- Intro ---------- */
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="mb-10"
            >
              <p className="mb-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {PERSONAL.title} at Raaz
              </p>
              <h1 className="text-[clamp(2.75rem,11vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-foreground">
                Hi, I&apos;m Rudra.
              </h1>
              <p className="mt-4 font-serif text-3xl italic text-accent/90 md:text-4xl">
                Ask me anything.
              </p>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-text-secondary">
                This portfolio is a conversation. I&apos;m an AI answering as Rudra —
                ask about my work, projects, and background. Type a question, or tap
                one below.
              </p>
            </motion.div>
          ) : (
            /* ---------- Conversation header ---------- */
            <motion.div
              key="thread-header"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-3 flex items-center justify-between"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary">
                Conversation
              </span>
              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-1.5 font-mono text-[11px] text-text-secondary transition-colors hover:text-accent"
              >
                <Plus size={13} />
                New chat
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Thread */}
        {started && (
          <div className="relative">
            <div
              ref={threadRef}
              onScroll={onThreadScroll}
              data-lenis-prevent
              role="log"
              aria-label="Conversation"
              aria-busy={streaming}
              aria-live="off"
              tabIndex={0}
              className="mb-4 max-h-[42svh] space-y-4 overflow-y-auto pr-1 md:max-h-[52vh]"
            >
              <AnimatePresence initial={false}>
                {(() => {
                  const seenCards = new Set<string>();
                  return messages.map((m, i) => {
                    const isLast = i === messages.length - 1;
                    if (m.role === "user") {
                      return (
                        <motion.div
                          key={m.id}
                          layout
                          initial={{ opacity: 0, y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.25, ease: EASE }}
                          className="flex justify-end"
                        >
                          <div className="max-w-[85%] rounded-2xl bg-accent/12 px-4 py-2.5 text-sm leading-relaxed text-foreground">
                            <span className="sr-only">You asked: </span>
                            {m.content}
                          </div>
                        </motion.div>
                      );
                    }

                    const { segments } = normalizeReply(m.content);
                    const isError = status === "error" && isLast;
                    const lastProse = segments.reduce(
                      (acc, s, idx) => (s.type === "prose" ? idx : acc),
                      -1
                    );
                    return (
                      <motion.div
                        key={m.id}
                        layout
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        className="flex flex-col items-start gap-2"
                      >
                        {segments.map((seg, si) => {
                          if (seg.type === "prose") {
                            return (
                              <div
                                key={si}
                                className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                                  isError
                                    ? "border border-red-400/25 bg-red-400/5 text-foreground/90"
                                    : "bg-card-bg text-foreground/90"
                                }`}
                              >
                                {si === 0 && (
                                  <span className="sr-only">Rudra (AI) replied: </span>
                                )}
                                {seg.text}
                                {streaming && isLast && si === lastProse && (
                                  <motion.span
                                    aria-hidden
                                    className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[2px] bg-accent align-middle"
                                    animate={{ opacity: [1, 0] }}
                                    transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                                  />
                                )}
                              </div>
                            );
                          }
                          const ckey = actionKey(seg.action);
                          if (seenCards.has(ckey)) return null;
                          seenCards.add(ckey);
                          return (
                            <div key={si} className="w-full max-w-[90%]">
                              <GenerativeBlock action={seg.action} />
                            </div>
                          );
                        })}
                        {isError && (
                          <button
                            type="button"
                            onClick={retry}
                            className="flex items-center gap-1.5 rounded-full border border-card-border px-3 py-1 font-mono text-[11px] text-text-secondary transition-colors hover:border-accent/40 hover:text-accent"
                          >
                            <RotateCw size={11} />
                            Retry
                          </button>
                        )}
                      </motion.div>
                    );
                  });
                })()}
              </AnimatePresence>

              {streaming && messages[messages.length - 1]?.content === "" && (
                <ThinkingDots reduced={reduced} />
              )}
              {followups.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {followups.map((q) => (
                    <motion.button
                      key={q}
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={() => submit(q)}
                      className="rounded-full border border-card-border bg-card-bg px-3 py-1.5 text-[13px] text-text-secondary transition-colors hover:border-accent/40 hover:text-foreground"
                    >
                      {q}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Jump-to-latest when scrolled up */}
            <AnimatePresence>
              {!atBottom && (
                <motion.button
                  type="button"
                  onClick={jumpToLatest}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-card-border bg-background/90 px-3 py-1 font-mono text-[11px] text-text-secondary shadow-lg backdrop-blur-md hover:text-accent"
                >
                  New reply
                  <ArrowDown size={12} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Input or limit-reached end-card (keep input/Stop until the final
            reply finishes streaming) */}
        {limitReached && !streaming ? (
          <div className="rounded-2xl border border-card-border bg-card-bg p-5 text-center">
            <p className="text-sm leading-relaxed text-foreground/90">
              That&apos;s the session limit — for anything more, email me directly.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <a
                href={`mailto:${PERSONAL.email}`}
                className="inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Email me
              </a>
              <button
                type="button"
                onClick={reset}
                className="font-mono text-[11px] text-text-secondary transition-colors hover:text-accent"
              >
                Start over
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(draft);
            }}
            className="group rounded-2xl border border-white/[0.12] bg-[rgba(255,248,235,0.06)] p-2.5 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-colors focus-within:border-accent/50 focus-within:shadow-[0_0_0_1px_rgba(232,168,124,0.35),0_12px_48px_-12px_rgba(232,168,124,0.18)]"
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onFocus={handleFocus}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit(draft);
                  }
                }}
                rows={1}
                maxLength={CHAT_CONFIG.maxInputChars}
                aria-label="Ask a question"
                placeholder="Ask me about my work…"
                className="max-h-32 flex-1 resize-none bg-transparent px-2 py-1.5 text-base text-foreground placeholder:text-text-secondary/70 focus:outline-none md:text-lg"
              />
              {streaming ? (
                <motion.button
                  type="button"
                  onClick={stop}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Stop generating"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-card-bg text-foreground transition-colors hover:bg-card-bg/70 md:h-9 md:w-9"
                >
                  <Square size={14} />
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.9 }}
                  disabled={!draft.trim()}
                  aria-label="Send message"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-background transition-opacity disabled:opacity-30 md:h-9 md:w-9"
                >
                  <ArrowUp size={18} />
                </motion.button>
              )}
            </div>
          </form>
        )}

        {/* Starter chips — instant, precomputed answers (no API call) */}
        {!started && (
          <div className="mt-5">
            <p className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary/80">
              Try asking
            </p>
            <div className="flex flex-wrap gap-2">
              {STARTERS.map((s) => (
                <motion.button
                  key={s.q}
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    addExchange(s.q, s.a);
                    inputRef.current?.focus();
                  }}
                  className="flex min-h-[40px] items-center rounded-full border border-card-border bg-card-bg px-3.5 py-2 text-sm text-foreground/80 transition-colors hover:border-accent/40 hover:bg-accent/10 hover:text-foreground"
                >
                  {s.q}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="font-mono text-[11px] leading-relaxed text-text-secondary">
            AI-generated — may be imperfect. Email{" "}
            <a href={`mailto:${PERSONAL.email}`} className="text-accent hover:opacity-80">
              {PERSONAL.email}
            </a>{" "}
            for the real me.
          </p>
          {started && (
            <a href="#browse" className="font-mono text-[11px] text-text-secondary transition-colors hover:text-accent">
              ↓ Browse the full portfolio
            </a>
          )}
        </div>
      </div>

      {/* Initial scroll affordance */}
      {!started && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ScrollIndicator />
        </div>
      )}

      {/* Completed replies announced once to screen readers (not per token) */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announce}
      </div>
    </section>
  );
}

function ThinkingDots({ reduced }: { reduced: boolean }) {
  if (reduced) {
    return (
      <div className="flex justify-start">
        <div className="rounded-2xl bg-card-bg px-4 py-2.5 text-sm text-text-secondary">
          Thinking…
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start">
      <div className="flex gap-1 rounded-2xl bg-card-bg px-4 py-3">
        {[0, 1, 2].map((d) => (
          <motion.span
            key={d}
            className="h-1.5 w-1.5 rounded-full bg-text-secondary/60"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: d * 0.18 }}
          />
        ))}
      </div>
    </div>
  );
}
