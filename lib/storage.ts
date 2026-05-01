"use client";

import { useEffect, useState, useCallback } from "react";
import type { Swatch } from "./types";

const KEY = "smile.favorites.v1";

type Stored = (Swatch & { season?: string; ts: number })[];

function read(): Stored {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Stored) : [];
  } catch {
    return [];
  }
}

function write(items: Stored) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("smile-favorites"));
  } catch {
    /* quota or private mode — ignore */
  }
}

export function useFavorites() {
  const [items, setItems] = useState<Stored>([]);

  useEffect(() => {
    setItems(read());
    const sync = () => setItems(read());
    window.addEventListener("smile-favorites", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("smile-favorites", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const has = useCallback((hex: string) => items.some((i) => i.hex === hex), [items]);

  const toggle = useCallback(
    (s: Swatch, season?: string) => {
      const current = read();
      const next = current.some((i) => i.hex === s.hex)
        ? current.filter((i) => i.hex !== s.hex)
        : [...current, { ...s, season, ts: Date.now() }];
      write(next);
      setItems(next);
    },
    []
  );

  const clear = useCallback(() => {
    write([]);
    setItems([]);
  }, []);

  return { items, has, toggle, clear };
}
