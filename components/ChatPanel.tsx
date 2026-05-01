"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AnalysisResult, ChatMessage } from "@/lib/types";

const SUGGESTIONS = [
  "Почему мне не идёт чёрный?",
  "Какая помада подойдёт?",
  "Что надеть на собеседование?",
  "Подскажи цвет волос"
];

export default function ChatPanel({ result }: { result: AnalysisResult }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, result })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "ошибка";
      setMessages([...next, { role: "assistant", content: "Ошибка: " + msg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        ref={scrollRef}
        className="min-h-[120px] max-h-[480px] overflow-y-auto space-y-5 mb-6 pr-2 scrollbar-thin"
      >
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-x-5 gap-y-2 py-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-sm text-ink-500 hover:text-accent transition border-b border-ink-100 hover:border-accent pb-0.5"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-12 gap-x-4 items-start"
            >
              <div className="col-span-2 md:col-span-1 pt-0.5">
                <p className="label">
                  {m.role === "user" ? "Ты" : "AI"}
                </p>
              </div>
              <div className="col-span-10 md:col-span-11">
                <p className="text-base text-ink-900 leading-relaxed whitespace-pre-line">
                  {m.content}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-12 gap-x-4 items-start"
          >
            <div className="col-span-2 md:col-span-1 pt-0.5">
              <p className="label">AI</p>
            </div>
            <div className="col-span-10 md:col-span-11 flex gap-1.5 pt-2">
              {[0, 0.15, 0.3].map((d) => (
                <motion.span
                  key={d}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: d }}
                  className="w-1 h-1 rounded-full bg-ink-400"
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="hairline pt-4 flex items-center gap-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Задай вопрос…"
          disabled={loading}
          className="flex-1 bg-transparent border-0 focus:outline-none text-base placeholder:text-ink-300 py-1"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="text-sm text-ink-900 hover:text-accent disabled:text-ink-300 transition font-medium"
        >
          Отправить →
        </button>
      </form>
    </div>
  );
}
