"use client";

import { motion } from "framer-motion";
import type { AnalysisResult, Swatch } from "@/lib/types";
import ChatPanel from "./ChatPanel";
import PaletteSection from "./PaletteSection";
import SeasonCompare from "./SeasonCompare";
import MakeupStudio from "./MakeupStudio";
import { copyHex } from "@/lib/toast";

export default function ResultView({
  result,
  photo,
  onReset
}: {
  result: AnalysisResult;
  photo: string;
  onReset: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-8"
    >
      {/* Magazine cover */}
      <section className="grid grid-cols-12 gap-x-6 pt-8 pb-16 md:pb-24">
        <div className="col-span-12 md:col-span-2">
          <p className="label">
            Colour Index
            <br />
            <span className="text-ink-900 font-medium tabular">
              No. {seasonNumber(result.season)}
            </span>
          </p>
        </div>

        <div className="col-span-12 md:col-span-10">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-display-xl font-light text-ink-900"
          >
            {seasonRender(result.season)}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="hairline pt-5 mt-10 grid grid-cols-3 gap-x-6 max-w-2xl"
          >
            <Stat label="Подтон" value={tr.undertone[result.undertone]} />
            <Stat label="Контраст" value={tr.contrast[result.contrast]} />
            <Stat
              label="Насыщенность"
              value={result.saturation === "soft" ? "мягкая" : "яркая"}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-10 text-lg text-ink-700 leading-relaxed max-w-2xl whitespace-pre-line"
          >
            {result.explanation}
          </motion.p>
        </div>
      </section>

      <Section index="01" eyebrow="Палитра" title="Драпировка и цвета">
        <PaletteSection result={result} photo={photo} />
      </Section>

      <Section index="02" eyebrow="Вне регистра" title="Оттенки, которых стоит избегать">
        <AvoidGrid items={result.avoid} />
      </Section>

      <Section index="03" eyebrow="Контекст" title="Соседние сезоны">
        <SeasonCompare season={result.season} />
      </Section>

      <Section index="04" eyebrow="Аксессуары" title="Металлы">
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {result.metals.map((m) => (
            <span key={m} className="text-lg text-ink-900">
              <span className="text-ink-300 mr-2 tabular text-sm">·</span>
              {tr.metal[m]}
            </span>
          ))}
        </div>
      </Section>

      <Section index="05" eyebrow="Beauty" title="Макияж">
        <div className="grid md:grid-cols-2 gap-10">
          <MakeupBlock label="Дневной">{result.makeup.day}</MakeupBlock>
          <MakeupBlock label="Вечерний">{result.makeup.evening}</MakeupBlock>
        </div>
      </Section>

      <Section index="06" eyebrow="Try-on" title="Виртуальная примерка">
        <MakeupStudio result={result} photo={photo} />
      </Section>

      <Section index="07" eyebrow="Консультация" title="Личный стилист">
        <ChatPanel result={result} />
      </Section>

      <div className="hairline pt-6 mt-12 flex items-center justify-between">
        <p className="label">Конец выпуска</p>
        <button onClick={onReset} className="btn btn-ghost">
          Загрузить другое фото
        </button>
      </div>
    </motion.div>
  );
}

function Section({
  index,
  eyebrow,
  title,
  children
}: {
  index: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="hairline grid grid-cols-12 gap-x-6 py-12 md:py-16"
    >
      <div className="col-span-12 md:col-span-2">
        <p className="label">
          {eyebrow}
          <br />
          <span className="text-ink-900 font-medium tabular">{index}</span>
        </p>
      </div>
      <div className="col-span-12 md:col-span-10">
        <h3 className="font-display text-display-md font-light text-ink-900 mb-8">{title}</h3>
        {children}
      </div>
    </motion.section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="label">{label}</p>
      <p className="font-display text-xl font-light text-ink-900 mt-1 first-letter:uppercase">
        {value}
      </p>
    </div>
  );
}

function MakeupBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="label mb-3">{label}</p>
      <p className="text-base text-ink-700 leading-relaxed whitespace-pre-line">{children}</p>
    </div>
  );
}

function AvoidGrid({ items }: { items: Swatch[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-x-4 gap-y-6">
      {items.map((c, i) => (
        <motion.figure
          key={c.hex + i}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.04 }}
        >
          <div
            className="aspect-square rounded-md ring-1 ring-ink-100 opacity-50 grayscale-[20%]"
            style={{ background: c.hex }}
          />
          <figcaption className="mt-2 flex items-baseline justify-between gap-2">
            <span className="text-xs text-ink-700 truncate first-letter:uppercase" title={c.name}>
              {c.name}
            </span>
            <button
              onClick={() => copyHex(c.hex)}
              className="label tabular shrink-0 hover:text-accent transition !text-[9px]"
            >
              {c.hex.replace("#", "")}
            </button>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}

function seasonNumber(season: string): string {
  const order = [
    "Bright Spring",
    "Warm Spring",
    "Light Spring",
    "Light Summer",
    "Cool Summer",
    "Soft Summer",
    "Soft Autumn",
    "Warm Autumn",
    "Deep Autumn",
    "Deep Winter",
    "Cool Winter",
    "Bright Winter"
  ];
  const i = order.indexOf(season);
  return String(i >= 0 ? i + 1 : 0).padStart(2, "0");
}

function seasonRender(season: string) {
  const parts = season.split(" ");
  if (parts.length < 2) return <>{season}</>;
  return (
    <>
      <span className="italic font-normal text-accent">{parts[0]}</span>
      <br />
      {parts.slice(1).join(" ")}.
    </>
  );
}

const tr = {
  undertone: { warm: "тёплый", cool: "холодный", neutral: "нейтральный" } as const,
  contrast: { low: "низкий", medium: "средний", high: "высокий" } as const,
  metal: { gold: "золото", silver: "серебро", "rose-gold": "розовое золото" } as const
};
