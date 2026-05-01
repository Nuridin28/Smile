"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FAMILY_PALETTES, seasonsInFamily, type Family } from "@/lib/seasons";

const FAMILIES: Family[] = ["Spring", "Summer", "Autumn", "Winter"];

const FAMILY_LABELS: Record<Family, string> = {
  Spring: "Весна",
  Summer: "Лето",
  Autumn: "Осень",
  Winter: "Зима"
};

export default function Hero({ onStart }: { onStart: () => void }) {
  const [open, setOpen] = useState<Family | null>(null);

  return (
    <section className="pt-12 pb-24 md:pt-20 md:pb-32">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-12 gap-x-6"
      >
        <div className="col-span-12 md:col-span-2">
          <p className="label">
            Edition
            <br />
            <span className="text-ink-900 font-medium">No. 01</span>
          </p>
        </div>

        <div className="col-span-12 md:col-span-10">
          <h1 className="font-display text-display-xl font-light text-ink-900">
            Узнай, какие
            <br />
            оттенки делают
            <br />
            тебя <span className="italic font-normal text-accent">живой</span>.
          </h1>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="grid grid-cols-12 gap-x-6 mt-12 md:mt-16"
      >
        <div className="col-span-12 md:col-span-2 md:col-start-3">
          <p className="label mb-2">Резюме</p>
        </div>
        <div className="col-span-12 md:col-span-7">
          <p className="text-lg md:text-xl text-ink-700 leading-relaxed max-w-xl">
            Персональный анализ внешности по 12-сезонной системе.
            Загружаешь фото — получаешь палитру, идеи макияжа
            и личного AI-консультанта.
          </p>

          <div className="flex items-center gap-6 mt-8">
            <button onClick={onStart} className="btn btn-primary">
              Начать анализ
              <span aria-hidden>→</span>
            </button>
            <a href="#process" className="link text-sm">
              Как это работает
            </a>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-20 md:mt-32"
      >
        <div className="hairline pt-6 grid grid-cols-12 gap-x-6">
          <div className="col-span-12 md:col-span-2 mb-4 md:mb-0">
            <p className="label">
              Образцы
              <br />
              <span className="text-ink-700">нажми → раскрыть</span>
            </p>
          </div>

          <div className="col-span-12 md:col-span-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
              {FAMILIES.map((fam, idx) => {
                const isOpen = open === fam;
                return (
                  <button
                    key={fam}
                    onClick={() => setOpen(isOpen ? null : fam)}
                    className="text-left group"
                  >
                    <motion.div
                      animate={{ height: isOpen ? 56 : 48 }}
                      className="flex rounded-md overflow-hidden ring-1 ring-ink-100 group-hover:ring-ink-300 transition"
                    >
                      {FAMILY_PALETTES[fam].map((c) => (
                        <motion.div
                          key={c}
                          whileHover={{ flexGrow: 1.2 }}
                          className="flex-1"
                          style={{ background: c }}
                        />
                      ))}
                    </motion.div>
                    <p className="mt-2.5 text-sm text-ink-700 tabular flex items-center justify-between">
                      <span>
                        <span className="text-ink-400 mr-2">0{idx + 1}</span>
                        {FAMILY_LABELS[fam]}
                      </span>
                      <span className="label !text-[10px]">{isOpen ? "−" : "+"}</span>
                    </p>
                  </button>
                );
              })}
            </div>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key={open}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="hairline mt-6 pt-6 space-y-6">
                    {seasonsInFamily(open).map((s) => (
                      <motion.div
                        key={s.name}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-12 gap-x-6 items-start"
                      >
                        <div className="col-span-12 md:col-span-3">
                          <p className="font-display text-xl font-light text-ink-900">
                            {s.name}
                          </p>
                          <p className="label mt-1">{s.traits}</p>
                        </div>
                        <div className="col-span-12 md:col-span-4 mt-2 md:mt-0">
                          <div className="flex h-10 rounded-md overflow-hidden ring-1 ring-ink-100">
                            {s.palette.map((c) => (
                              <div key={c} className="flex-1" style={{ background: c }} />
                            ))}
                          </div>
                        </div>
                        <div className="col-span-12 md:col-span-5 mt-2 md:mt-0">
                          <p className="text-sm text-ink-600 leading-relaxed">
                            {s.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
