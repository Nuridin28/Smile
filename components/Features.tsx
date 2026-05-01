"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    n: "01",
    title: "Анализ",
    desc: "Загружаешь портрет при дневном свете. Алгоритм считает подтон кожи, контраст и насыщенность."
  },
  {
    n: "02",
    title: "Палитра",
    desc: "AI определяет цветотип в 12-сезонной системе и подбирает 12 цветов одежды и 6 цветов, которых стоит избегать."
  },
  {
    n: "03",
    title: "Стилист",
    desc: "Уточняешь у личного AI-консультанта — что надеть, какую помаду, как одеться на конкретный случай."
  }
];

export default function Features() {
  return (
    <section id="process" className="py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-12 gap-x-6 mb-12 md:mb-20"
      >
        <div className="col-span-12 md:col-span-2">
          <p className="label">Процесс</p>
        </div>
        <div className="col-span-12 md:col-span-10">
          <h2 className="font-display text-display-md font-light text-ink-900 max-w-2xl">
            Три шага от селфи до цветовой карты —{" "}
            <span className="italic text-ink-500">меньше двух минут</span>.
          </h2>
        </div>
      </motion.div>

      <div>
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="hairline grid grid-cols-12 gap-x-6 py-8 md:py-10 group"
          >
            <div className="col-span-2 md:col-span-2">
              <p className="font-display text-2xl md:text-3xl font-light text-ink-300 tabular group-hover:text-accent transition-colors">
                {s.n}
              </p>
            </div>
            <div className="col-span-10 md:col-span-3">
              <h3 className="font-display text-2xl md:text-3xl font-light text-ink-900">
                {s.title}
              </h3>
            </div>
            <div className="col-span-12 md:col-span-7 mt-3 md:mt-1">
              <p className="text-base text-ink-600 leading-relaxed max-w-xl">{s.desc}</p>
            </div>
          </motion.div>
        ))}
        <div className="hairline" />
      </div>
    </section>
  );
}
