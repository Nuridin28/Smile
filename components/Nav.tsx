"use client";

export default function Nav({ onReset, showReset }: { onReset: () => void; showReset: boolean }) {
  return (
    <nav className="flex items-center justify-between py-6">
      <button onClick={onReset} className="flex items-center gap-2.5" aria-label="На главную">
        <span className="font-display text-2xl font-medium tracking-tight text-ink-900">
          Smile
        </span>
        <span className="label !text-[9px] mt-1">Colour Index</span>
      </button>

      {showReset && (
        <button
          onClick={onReset}
          className="label hover:text-ink-900 transition"
        >
          ← Заново
        </button>
      )}
    </nav>
  );
}
