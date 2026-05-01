"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Questionnaire as Q } from "@/lib/types";

const EYE = ["голубой", "серый", "зелёный", "ореховый", "карий", "тёмно-карий"];
const HAIR = [
  "платиновый блонд",
  "тёплый блонд",
  "русый",
  "каштановый",
  "рыжий",
  "тёмно-каштановый",
  "чёрный"
];
const SUN = [
  "всегда сгораю",
  "сначала сгораю, потом загораю",
  "легко загораю",
  "кожа практически не реагирует"
];

export default function Questionnaire({
  photo,
  onSubmit,
  onBack
}: {
  photo: string;
  onSubmit: (q: Q) => void;
  onBack: () => void;
}) {
  const [eyeColor, setEyeColor] = useState("");
  const [hairColor, setHairColor] = useState("");
  const [sunReaction, setSunReaction] = useState("");
  const [preferences, setPreferences] = useState("");

  const valid = eyeColor && hairColor && sunReaction;

  return (
    <div className="grid grid-cols-12 gap-x-6 py-12">
      <div className="col-span-12 md:col-span-2">
        <p className="label">
          Шаг
          <br />
          <span className="text-ink-900 font-medium tabular">02 / 02</span>
        </p>
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          src={photo}
          alt=""
          className="hidden md:block w-24 h-24 rounded-md object-cover mt-6 ring-1 ring-ink-100"
        />
      </div>

      <div className="col-span-12 md:col-span-10">
        <h2 className="font-display text-display-md font-light text-ink-900 mb-2">
          Расскажи <span className="italic text-ink-500">о себе</span>
        </h2>
        <p className="text-ink-600 mb-12 max-w-md">
          Эти данные уточнят результат. Уйдёт около 20 секунд.
        </p>

        <Field label="Цвет глаз" options={EYE} value={eyeColor} onChange={setEyeColor} />
        <Field label="Натуральный цвет волос" options={HAIR} value={hairColor} onChange={setHairColor} />
        <Field
          label="Реакция кожи на солнце"
          options={SUN}
          value={sunReaction}
          onChange={setSunReaction}
        />

        <div className="hairline pt-6 mt-10">
          <p className="label mb-3">
            Стилевые предпочтения <span className="lowercase tracking-normal text-ink-300 ml-1">— по желанию</span>
          </p>
          <textarea
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="Минимализм, ношу в основном на работу"
            className="w-full bg-transparent border-0 border-b border-ink-100 focus:border-ink-700 focus:outline-none py-2 text-base placeholder:text-ink-300 resize-none"
            rows={2}
          />
        </div>

        <div className="flex gap-3 mt-12">
          <button onClick={onBack} className="btn btn-ghost">
            <span aria-hidden>←</span>
            Назад
          </button>
          <button
            disabled={!valid}
            onClick={() =>
              onSubmit({
                eyeColor,
                hairColor,
                sunReaction,
                preferences: preferences || undefined
              })
            }
            className="btn btn-primary flex-1"
          >
            Анализировать
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  options,
  value,
  onChange
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="hairline pt-6 mt-8 first:mt-0 first:pt-0 first:border-0">
      <p className="label mb-4">{label}</p>
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        {options.map((o) => {
          const active = value === o;
          return (
            <button
              key={o}
              type="button"
              onClick={() => onChange(o)}
              className={`relative pb-1 text-base transition ${
                active
                  ? "text-ink-900 font-medium"
                  : "text-ink-400 hover:text-ink-700"
              }`}
            >
              {o}
              {active && (
                <motion.span
                  layoutId={`u-${label}`}
                  className="absolute left-0 right-0 -bottom-0 h-px bg-accent"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
