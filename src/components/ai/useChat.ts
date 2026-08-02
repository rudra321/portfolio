"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getProvider } from "@/lib/chat";
import { CHAT_CONFIG } from "@/lib/chat/config";
import { parseActions } from "@/lib/chat/actions";
import { clog } from "@/lib/chat/debug";
import type { ChatMessage } from "@/lib/chat/types";
import { PERSONAL } from "@/data/personal";

export type ChatStatus = "idle" | "streaming" | "error";

// Persist the thread so a refresh (or coming back later) keeps the conversation.
const STORAGE_KEY = "rudra-chat-v1";

const dropEmptyTrailingModel = (msgs: ChatMessage[]): ChatMessage[] => {
  const last = msgs[msgs.length - 1];
  return last && last.role === "model" && last.content === ""
    ? msgs.slice(0, -1)
    : msgs;
};

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [announce, setAnnounce] = useState("");

  const messagesRef = useRef<ChatMessage[]>([]);
  const busyRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const providerRef = useRef(getProvider());
  const idRef = useRef(0);
  const announcedRef = useRef<string>("");
  const hydratedRef = useRef(false);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Restore a saved thread once, on mount (after hydration, to avoid a mismatch).
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved: ChatMessage[] = JSON.parse(raw);
      const clean = Array.isArray(saved)
        ? saved.filter((m) => (m.role === "user" || m.role === "model") && !(m.role === "model" && m.content === ""))
        : [];
      if (clean.length === 0) return;
      // Bump the id counter past any restored ids so new messages don't collide.
      let max = -1;
      for (const m of clean) {
        const n = m.id ? Number(m.id.replace(/^m/, "")) : NaN;
        if (Number.isFinite(n)) max = Math.max(max, n);
      }
      idRef.current = max + 1;
      clog("useChat", `restored ${clean.length} saved messages`);
      setMessages(clean);
    } catch {
      // corrupt / incompatible payload → start fresh
    }
  }, []);

  // Save only settled turns (never a mid-stream or errored bubble). Clearing is
  // done explicitly in reset() to avoid racing the mount-time restore.
  useEffect(() => {
    if (!hydratedRef.current || status !== "idle" || messages.length === 0) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // storage full / disabled → persistence is best-effort
    }
  }, [messages, status]);

  const nextId = () => `m${idRef.current++}`;

  // Re-announce finished replies to screen readers (empty→set forces SR to
  // re-read even identical text).
  const pushAnnounce = useCallback((id: string, text: string) => {
    if (announcedRef.current === id) return;
    announcedRef.current = id;
    setAnnounce("");
    requestAnimationFrame(() => setAnnounce(text));
  }, []);

  const userTurns = messages.filter((m) => m.role === "user").length;
  const limitReached = userTurns >= CHAT_CONFIG.sessionMessageLimit;

  // Core streaming run. `history` must already end with the user turn to answer.
  const runStream = useCallback(
    async (history: ChatMessage[]) => {
      if (busyRef.current) return;
      busyRef.current = true;

      const modelId = nextId();
      setMessages([...history, { id: modelId, role: "model", content: "" }]);
      setStatus("streaming");

      const controller = new AbortController();
      abortRef.current = controller;

      let acc = "";
      try {
        const sent = history.slice(-CHAT_CONFIG.maxHistoryMessages);
        for await (const delta of providerRef.current.streamReply(sent, controller.signal)) {
          if (controller.signal.aborted) break;
          acc += delta;
          setMessages((prev) => {
            const next = prev.slice();
            const last = next[next.length - 1];
            next[next.length - 1] = { ...last, content: last.content + delta };
            return next;
          });
        }
        if (abortRef.current !== controller) return; // superseded by reset()/new run
        if (controller.signal.aborted) setMessages(dropEmptyTrailingModel);
        else pushAnnounce(modelId, parseActions(acc).text);
        clog("useChat", controller.signal.aborted ? "stopped" : `stream complete (${acc.length} chars)`);
        if (!controller.signal.aborted) clog("reply", acc);
        setStatus("idle");
      } catch (err) {
        if (abortRef.current !== controller) return; // superseded by reset()/new run
        if (controller.signal.aborted) {
          setMessages(dropEmptyTrailingModel);
          setStatus("idle");
        } else {
          clog("useChat", "run failed — showing error bubble", err);
          setMessages((prev) => {
            const next = prev.slice();
            next[next.length - 1] = {
              id: modelId,
              role: "model",
              content: `Sorry — I couldn't reach the AI just now. You can email me at ${PERSONAL.email}.\n[[ui:contact]]`,
            };
            return next;
          });
          setStatus("error");
        }
      } finally {
        // Only the still-current run may release the shared guards — a run that
        // was superseded by reset()/a new send must not clobber them.
        if (abortRef.current === controller) {
          busyRef.current = false;
          abortRef.current = null;
        }
      }
    },
    [pushAnnounce]
  );

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim().slice(0, CHAT_CONFIG.maxInputChars);
      const current = messagesRef.current;
      const turns = current.filter((m) => m.role === "user").length;
      if (!text || busyRef.current || turns >= CHAT_CONFIG.sessionMessageLimit) return;
      clog("useChat", "send", text);
      runStream([...current, { id: nextId(), role: "user", content: text }]);
    },
    [runStream]
  );

  // Re-run the last user turn after an error (drops the failed model reply).
  const retry = useCallback(() => {
    if (busyRef.current) return;
    let base = messagesRef.current;
    if (base[base.length - 1]?.role === "model") base = base.slice(0, -1);
    if (base[base.length - 1]?.role !== "user") return;
    runStream(base);
  }, [runStream]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null; // mark any in-flight run as superseded
    busyRef.current = false;
    announcedRef.current = "";
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setMessages([]);
    setStatus("idle");
    setAnnounce("");
  }, []);

  const stop = useCallback(() => abortRef.current?.abort(), []);

  // Append a precomputed exchange WITHOUT calling the provider — starter chips.
  const addExchange = useCallback(
    (userText: string, modelText: string) => {
      if (busyRef.current || messagesRef.current.length > 0) return;
      clog("useChat", "starter chip", userText);
      clog("reply", modelText);
      const modelId = nextId();
      setMessages([
        { id: nextId(), role: "user", content: userText },
        { id: modelId, role: "model", content: modelText },
      ]);
      pushAnnounce(modelId, parseActions(modelText).text);
    },
    [pushAnnounce]
  );

  return {
    messages,
    status,
    announce,
    limitReached,
    send,
    stop,
    retry,
    reset,
    addExchange,
  };
}
