"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Swatch } from "@/lib/types";

export default function DrapeStudio({ photo, drape }: { photo: string; drape: Swatch | null }) {
  return (
    <div className="md:sticky md:top-6">
      <div className="relative w-full max-w-[260px] mx-auto md:mx-0">
        <img
          src={photo}
          alt="портрет"
          className="w-full aspect-[4/5] object-cover rounded-md ring-1 ring-ink-100"
        />

        <AnimatePresence mode="wait">
          {drape && (
            <motion.div
              key={drape.hex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 right-0 bottom-0 h-[40%] rounded-b-md overflow-hidden pointer-events-none"
              style={{ background: drape.hex }}
            >
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.15) 100%)"
                }}
              />
              <div
                className="absolute inset-0 opacity-20 mix-blend-overlay"
                style={{
                  background:
                    "repeating-linear-gradient(110deg, rgba(255,255,255,0.18) 0 1px, transparent 1px 6px)"
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 max-w-[260px] mx-auto md:mx-0 min-h-[64px]">
        <AnimatePresence mode="wait">
          {drape ? (
            <motion.div
              key={drape.hex}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
            >
              <p className="label mb-1">Сейчас драпируешь</p>
              <p className="text-base text-ink-900 first-letter:uppercase">{drape.name}</p>
              <p className="label tabular mt-0.5">{drape.hex.toUpperCase()}</p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="label mb-1">Драпировка</p>
              <p className="text-sm text-ink-500 leading-snug">
                Кликни любой цвет в палитре — он «приложится» к лицу,
                как ткань у настоящего колориста.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
