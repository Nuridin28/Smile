"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { findSeason, siblingSeasons, type SeasonData } from "@/lib/seasons";

export default function SeasonCompare({ season }: { season: string }) {
  const me = findSeason(season);
  const siblings = siblingSeasons(season);
  const [active, setActive] = useState<SeasonData | null>(null);

  if (!me || siblings.length === 0) return null;

  return (
    <div>
      <p className="text-base text-ink-700 leading-relaxed mb-6 max-w-xl">
        Внутри семьи <span className="italic text-accent">{me.family}</span> у тебя
        ещё {siblings.length} соседних сезона. Сравни — поймёшь, почему AI выбрал
        именно твой.
      </p>

      <div className="space-y-3">
        <Row data={me} mine active={active === me} onClick={() => setActive(active === me ? null : me)} />
        {siblings.map((s) => (
          <Row
            key={s.name}
            data={s}
            active={active === s}
            onClick={() => setActive(active === s ? null : s)}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.name}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="hairline mt-6 pt-6">
              <p className="text-base text-ink-700 leading-relaxed max-w-2xl">
                {active.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({
  data,
  active,
  mine,
  onClick
}: {
  data: SeasonData;
  active: boolean;
  mine?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full grid grid-cols-12 gap-x-4 items-center p-3 rounded-md text-left transition ${
        active
          ? "bg-cream-50 ring-1 ring-ink-200"
          : "hover:bg-cream-50/60"
      }`}
    >
      <div className="col-span-5 md:col-span-3 flex items-center gap-2">
        {mine && (
          <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" aria-label="Это ты" />
        )}
        <span className="font-display text-lg font-light text-ink-900">{data.name}</span>
      </div>
      <div className="col-span-7 md:col-span-6">
        <div className="flex h-7 rounded-md overflow-hidden ring-1 ring-ink-100">
          {data.palette.map((c) => (
            <div key={c} className="flex-1" style={{ background: c }} />
          ))}
        </div>
      </div>
      <div className="col-span-12 md:col-span-3 mt-2 md:mt-0">
        <p className="label">{data.traits}</p>
      </div>
    </button>
  );
}
