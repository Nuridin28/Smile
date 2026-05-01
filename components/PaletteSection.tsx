"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AnalysisResult, Swatch } from "@/lib/types";
import { useFavorites } from "@/lib/storage";
import { copyHex, toast } from "@/lib/toast";
import DrapeStudio from "./DrapeStudio";

const MAX_COMBO = 3;

export default function PaletteSection({
  result,
  photo
}: {
  result: AnalysisResult;
  photo: string;
}) {
  const [drape, setDrape] = useState<Swatch | null>(result.palette[0] ?? null);
  const [combo, setCombo] = useState<Swatch[]>([]);
  const [comboReply, setComboReply] = useState<string>("");
  const [comboLoading, setComboLoading] = useState(false);
  const fav = useFavorites();

  const inCombo = (hex: string) => combo.some((c) => c.hex === hex);

  const toggleCombo = (s: Swatch) => {
    if (inCombo(s.hex)) {
      setCombo((c) => c.filter((x) => x.hex !== s.hex));
    } else if (combo.length >= MAX_COMBO) {
      toast(`Максимум ${MAX_COMBO} цвета в комбо`);
    } else {
      setCombo((c) => [...c, s]);
    }
    setComboReply("");
  };

  const askCombo = async () => {
    if (combo.length < 2) return;
    setComboLoading(true);
    setComboReply("");
    try {
      const res = await fetch("/api/combo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result, swatches: combo })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setComboReply(data.reply);
    } catch (e: unknown) {
      setComboReply("Ошибка: " + (e instanceof Error ? e.message : "—"));
    } finally {
      setComboLoading(false);
    }
  };

  const onFav = (s: Swatch) => {
    const wasFav = fav.has(s.hex);
    fav.toggle(s, result.season);
    toast(wasFav ? "Удалено из избранного" : "Добавлено в избранное");
  };

  return (
    <div className="grid grid-cols-12 gap-x-6">
      <div className="col-span-12 md:col-span-4 mb-10 md:mb-0">
        <DrapeStudio photo={photo} drape={drape} />
      </div>

      <div className="col-span-12 md:col-span-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-8">
          {result.palette.map((c, i) => (
            <Swatch
              key={c.hex + i}
              swatch={c}
              active={drape?.hex === c.hex}
              selected={inCombo(c.hex)}
              favorite={fav.has(c.hex)}
              onActivate={() => setDrape(c)}
              onCombo={() => toggleCombo(c)}
              onFav={() => onFav(c)}
              delay={i * 0.03}
            />
          ))}
        </div>

        {/* combo bar */}
        <AnimatePresence>
          {combo.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="hairline pt-5 mt-10 flex flex-wrap items-center gap-4"
            >
              <p className="label">
                Комбо
                <br />
                <span className="text-ink-700 tabular">
                  {combo.length} / {MAX_COMBO}
                </span>
              </p>
              <div className="flex gap-1.5 flex-1">
                {combo.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => toggleCombo(c)}
                    title="Убрать"
                    className="w-9 h-9 rounded-md ring-1 ring-ink-100 hover:ring-accent transition relative"
                    style={{ background: c.hex }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-cream-50 opacity-0 hover:opacity-100 transition text-xs">
                      ×
                    </span>
                  </button>
                ))}
              </div>
              <button
                onClick={askCombo}
                disabled={combo.length < 2 || comboLoading}
                className="btn btn-primary"
              >
                {comboLoading ? "Думаю…" : "Оценить комбо →"}
              </button>
              <button
                onClick={() => {
                  setCombo([]);
                  setComboReply("");
                }}
                className="text-sm text-ink-500 hover:text-ink-900 transition"
              >
                сбросить
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {comboReply && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-6 grid grid-cols-12 gap-x-4">
                <p className="label col-span-2 md:col-span-1 pt-1">AI</p>
                <p className="col-span-10 md:col-span-11 text-base text-ink-900 leading-relaxed whitespace-pre-line">
                  {comboReply}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {fav.items.length > 0 && (
          <FavoritesStrip
            items={fav.items}
            onClear={() => {
              fav.clear();
              toast("Избранное очищено");
            }}
          />
        )}
      </div>
    </div>
  );
}

function Swatch({
  swatch,
  active,
  selected,
  favorite,
  onActivate,
  onCombo,
  onFav,
  delay
}: {
  swatch: Swatch;
  active: boolean;
  selected: boolean;
  favorite: boolean;
  onActivate: () => void;
  onCombo: () => void;
  onFav: () => void;
  delay: number;
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="group"
    >
      <button
        onClick={onActivate}
        className={`relative w-full aspect-[4/5] rounded-md ring-1 transition cursor-pointer overflow-hidden ${
          active ? "ring-accent ring-2" : "ring-ink-100 hover:ring-ink-300"
        }`}
        style={{ background: swatch.hex }}
        aria-label={`Драпировать ${swatch.name}`}
      >
        {active && (
          <motion.span
            layoutId="active-marker"
            className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-cream-50 mix-blend-difference"
          />
        )}

        {/* corner buttons */}
        <span className="absolute top-1.5 right-1.5 flex flex-col gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition">
          <ActionDot
            onClick={(e) => {
              e.stopPropagation();
              onFav();
            }}
            label={favorite ? "Убрать из избранного" : "В избранное"}
            active={favorite}
          >
            <HeartIcon filled={favorite} />
          </ActionDot>
          <ActionDot
            onClick={(e) => {
              e.stopPropagation();
              onCombo();
            }}
            label="Добавить в комбо"
            active={selected}
          >
            {selected ? <CheckIcon /> : <PlusIcon />}
          </ActionDot>
        </span>
      </button>

      <figcaption className="mt-3 flex items-baseline justify-between gap-2">
        <span
          className="text-sm text-ink-900 truncate first-letter:uppercase"
          title={swatch.name}
        >
          {swatch.name}
        </span>
        <button
          onClick={() => copyHex(swatch.hex)}
          className="label tabular shrink-0 hover:text-accent transition"
          title="Скопировать hex"
        >
          {swatch.hex.replace("#", "")}
        </button>
      </figcaption>
    </motion.figure>
  );
}

function ActionDot({
  children,
  onClick,
  label,
  active
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition ${
        active
          ? "bg-ink-900 text-cream-50"
          : "bg-cream-50/80 text-ink-700 hover:bg-cream-50"
      }`}
    >
      {children}
    </button>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"}>
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12l5 5L20 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FavoritesStrip({
  items,
  onClear
}: {
  items: { hex: string; name: string; season?: string }[];
  onClear: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="hairline pt-6 mt-12"
    >
      <div className="flex items-baseline justify-between mb-4">
        <p className="label">
          Избранное
          <span className="text-ink-700 tabular ml-2">{items.length}</span>
        </p>
        <button
          onClick={onClear}
          className="label hover:text-accent transition"
        >
          Очистить
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((it) => (
          <button
            key={it.hex}
            onClick={() => copyHex(it.hex)}
            className="group flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-ink-50 hover:bg-ink-100 transition"
            title={`${it.name} · клик чтобы скопировать`}
          >
            <span
              className="w-5 h-5 rounded-full ring-1 ring-ink-200"
              style={{ background: it.hex }}
            />
            <span className="text-xs text-ink-700 tabular">{it.hex.toUpperCase()}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
