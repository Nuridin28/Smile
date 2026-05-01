"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import PhotoUpload from "@/components/PhotoUpload";
import Questionnaire from "@/components/Questionnaire";
import ResultView from "@/components/ResultView";
import type { AnalysisResult, Questionnaire as Q } from "@/lib/types";

type Step = "upload" | "questionnaire" | "analyzing" | "result" | "error";

export default function Home() {
  const [step, setStep] = useState<Step>("upload");
  const [photo, setPhoto] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>("");
  const flowRef = useRef<HTMLDivElement>(null);

  const scrollToFlow = () => {
    setTimeout(() => {
      flowRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  const analyze = async (q: Q) => {
    setStep("analyzing");
    scrollToFlow();
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: photo, questionnaire: q })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "ошибка анализа");
      setResult(data);
      setStep("result");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "неизвестная ошибка");
      setStep("error");
    }
  };

  const reset = () => {
    setPhoto(null);
    setResult(null);
    setError("");
    setStep("upload");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showLanding = step === "upload" && !photo;

  return (
    <main className="max-w-6xl mx-auto px-6 md:px-10 pb-20">
      <Nav onReset={reset} showReset={step !== "upload" || !!photo} />
      <div className="hairline" />

      <AnimatePresence mode="wait">
        {showLanding && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <Hero onStart={scrollToFlow} />
            <Features />
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={flowRef} className="scroll-mt-6">
        <AnimatePresence mode="wait">
          {step === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className={showLanding ? "hairline" : ""}
            >
              <PhotoUpload
                onUpload={(b64) => {
                  setPhoto(b64);
                  setStep("questionnaire");
                  scrollToFlow();
                }}
              />
            </motion.div>
          )}

          {step === "questionnaire" && photo && (
            <motion.div
              key="q"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <Questionnaire
                photo={photo}
                onSubmit={analyze}
                onBack={() => setStep("upload")}
              />
            </motion.div>
          )}

          {step === "analyzing" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-12 gap-x-6 py-32"
            >
              <div className="col-span-12 md:col-span-2">
                <p className="label">Анализ</p>
              </div>
              <div className="col-span-12 md:col-span-10">
                <h2 className="font-display text-display-md font-light text-ink-900">
                  Считаю подтон, контраст, насыщенность<span className="italic text-ink-500">…</span>
                </h2>
                <Loader />
                <p className="label mt-6">Обычно 5–15 секунд</p>
              </div>
            </motion.div>
          )}

          {step === "result" && result && photo && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ResultView result={result} photo={photo} onReset={reset} />
            </motion.div>
          )}

          {step === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-12 gap-x-6 py-24"
            >
              <div className="col-span-12 md:col-span-2">
                <p className="label">Ошибка</p>
              </div>
              <div className="col-span-12 md:col-span-10">
                <h2 className="font-display text-display-md font-light text-ink-900">
                  Что-то пошло не так
                </h2>
                <p className="text-ink-600 mt-3">{error}</p>
                <button onClick={reset} className="btn btn-primary mt-8">
                  Попробовать снова
                  <span aria-hidden>→</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="hairline pt-6 mt-20 flex items-center justify-between text-ink-400">
        <p className="label">© 2026 · Smile · Colour Index No. 01</p>
        <p className="label">Powered by GPT-4o</p>
      </footer>
    </main>
  );
}

function Loader() {
  return (
    <div className="mt-10 flex items-center gap-2">
      {[0, 0.15, 0.3, 0.45, 0.6].map((d, i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: d }}
          className="block h-px w-10 bg-ink-900"
        />
      ))}
    </div>
  );
}
