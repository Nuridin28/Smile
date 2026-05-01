"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ToastEvent } from "@/lib/toast";

type Item = { id: number; message: string };

export default function Toaster() {
  const [items, setItems] = useState<Item[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ToastEvent>).detail;
      const id = ++idRef.current;
      setItems((prev) => [...prev, { id, message: detail.message }]);
      setTimeout(() => {
        setItems((prev) => prev.filter((i) => i.id !== id));
      }, 2200);
    };
    window.addEventListener("smile-toast", handler);
    return () => window.removeEventListener("smile-toast", handler);
  }, []);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center gap-2">
      <AnimatePresence>
        {items.map((it) => (
          <motion.div
            key={it.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="px-4 py-2.5 rounded-full bg-ink-900 text-cream-50 text-sm font-medium shadow-lg tabular"
          >
            {it.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
