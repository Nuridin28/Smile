"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AnalysisResult } from "@/lib/types";
import { detectLandmarks, type Landmark } from "@/lib/face";
import { paintMakeup, type ZoneColors } from "@/lib/makeup";
import { copyHex } from "@/lib/toast";

type Zone = "lips" | "eyes" | "cheeks";

const ZONES: { id: Zone; label: string }[] = [
  { id: "lips", label: "Губы" },
  { id: "eyes", label: "Веки" },
  { id: "cheeks", label: "Щёки" }
];

export default function MakeupStudio({
  result,
  photo
}: {
  result: AnalysisResult;
  photo: string;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [landmarks, setLandmarks] = useState<Landmark[] | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "no-face" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeZone, setActiveZone] = useState<Zone>("lips");
  const [colors, setColors] = useState<ZoneColors>({
    lips: null,
    eyes: null,
    cheeks: null
  });

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = async () => {
      try {
        const lm = await detectLandmarks(img);
        if (cancelled) return;
        if (!lm) {
          setStatus("no-face");
          return;
        }
        setLandmarks(lm);
        // size canvas to natural image dimensions
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
        }
        setStatus("ready");
      } catch (e: unknown) {
        if (cancelled) return;
        setErrorMsg(e instanceof Error ? e.message : "ошибка модели");
        setStatus("error");
      }
    };
    img.onerror = () => {
      if (!cancelled) {
        setErrorMsg("не удалось загрузить изображение");
        setStatus("error");
      }
    };
    img.src = photo;
    return () => {
      cancelled = true;
    };
  }, [photo]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !landmarks) return;
    paintMakeup(canvas, landmarks, colors);
  }, [colors, landmarks]);

  const apply = (hex: string) => {
    setColors((c) => ({ ...c, [activeZone]: c[activeZone] === hex ? null : hex }));
  };

  const reset = () => setColors({ lips: null, eyes: null, cheeks: null });

  const allPalette = [...result.palette];

  return (
    <div className="grid grid-cols-12 gap-x-6">
      <div className="col-span-12 md:col-span-5 mb-8 md:mb-0">
        <div className="relative w-full max-w-[320px] mx-auto md:mx-0">
          <img
            ref={imgRef}
            src={photo}
            alt="портрет"
            className="w-full block rounded-md ring-1 ring-ink-100"
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none rounded-md"
          />

          <AnimatePresence>
            {status === "loading" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-cream-50/70 backdrop-blur-sm rounded-md"
              >
                <div className="text-center">
                  <Pulse />
                  <p className="label mt-3">Загружаю модель</p>
                  <p className="text-[11px] text-ink-400 mt-1">Первый раз — около 6 МБ</p>
                </div>
              </motion.div>
            )}

            {status === "no-face" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-cream-50/85 rounded-md p-4"
              >
                <p className="text-sm text-ink-700 text-center">
                  Не нашёл лицо на фото.
                  <br />
                  Загрузи портрет крупным планом.
                </p>
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-cream-50/85 rounded-md p-4"
              >
                <p className="text-sm text-red-700 text-center">
                  Ошибка модели:
                  <br />
                  {errorMsg}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="col-span-12 md:col-span-7">
        <p className="text-base text-ink-700 leading-relaxed mb-8 max-w-md">
          Выбери зону и тапни любой цвет из палитры —
          модель найдёт лицо и наложит макияж по точкам мимики.
          Можно совмещать все три зоны.
        </p>

        <div className="hairline pt-5 mb-6">
          <p className="label mb-3">Зона</p>
          <div className="flex gap-2">
            {ZONES.map((z) => {
              const active = activeZone === z.id;
              const assigned = colors[z.id];
              return (
                <button
                  key={z.id}
                  onClick={() => setActiveZone(z.id)}
                  disabled={status !== "ready"}
                  className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition flex items-center justify-center gap-2 ${
                    active
                      ? "bg-ink-900 text-cream-50"
                      : "bg-cream-50 text-ink-700 hover:bg-ink-50 ring-1 ring-ink-100"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {z.label}
                  {assigned && (
                    <span
                      className="w-3 h-3 rounded-full ring-1 ring-current/30"
                      style={{ background: assigned }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="hairline pt-5 mb-6">
          <div className="flex items-baseline justify-between mb-3">
            <p className="label">Палитра</p>
            <p className="label !text-[10px]">кликни → применить</p>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5">
            {allPalette.map((c) => {
              const used = colors[activeZone] === c.hex;
              return (
                <button
                  key={c.hex}
                  onClick={() => apply(c.hex)}
                  disabled={status !== "ready"}
                  title={`${c.name} · ${c.hex}`}
                  className={`relative aspect-square rounded-md transition disabled:opacity-40 disabled:cursor-not-allowed ${
                    used
                      ? "ring-2 ring-accent ring-offset-2 ring-offset-cream-100"
                      : "ring-1 ring-ink-100 hover:ring-ink-400"
                  }`}
                  style={{ background: c.hex }}
                />
              );
            })}
          </div>
        </div>

        <div className="hairline pt-5 flex items-center justify-between">
          <CurrentLook colors={colors} palette={allPalette} />
          <button
            onClick={reset}
            disabled={!colors.lips && !colors.eyes && !colors.cheeks}
            className="text-sm text-ink-500 hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            Снять весь макияж
          </button>
        </div>
      </div>
    </div>
  );
}

function CurrentLook({
  colors,
  palette
}: {
  colors: ZoneColors;
  palette: { hex: string; name: string }[];
}) {
  const items = ([
    ["Губы", colors.lips],
    ["Веки", colors.eyes],
    ["Щёки", colors.cheeks]
  ] as const).filter(([, hex]) => hex !== null) as [string, string][];

  if (items.length === 0) {
    return <p className="label">Образ пустой</p>;
  }

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-ink-700">
      {items.map(([label, hex]) => {
        const sw = palette.find((p) => p.hex === hex);
        return (
          <button
            key={label}
            onClick={() => copyHex(hex)}
            className="flex items-center gap-1.5 hover:text-accent transition"
            title="Скопировать hex"
          >
            <span
              className="w-3 h-3 rounded-full ring-1 ring-ink-200"
              style={{ background: hex }}
            />
            <span className="text-ink-500">{label}:</span>
            <span className="tabular text-xs">{sw?.name ?? hex}</span>
          </button>
        );
      })}
    </div>
  );
}

function Pulse() {
  return (
    <div className="flex items-center gap-1.5 justify-center">
      {[0, 0.15, 0.3, 0.45, 0.6].map((d, i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: d }}
          className="block h-px w-6 bg-ink-900"
        />
      ))}
    </div>
  );
}
