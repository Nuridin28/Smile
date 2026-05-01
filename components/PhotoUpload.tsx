"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PhotoUpload({ onUpload }: { onUpload: (b64: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  const resizeAndSet = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setBusy(true);
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 1024;
        let { width, height } = img;
        if (width > max || height > max) {
          if (width > height) {
            height = (height / width) * max;
            width = max;
          } else {
            width = (width / height) * max;
            height = max;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        setPreview(canvas.toDataURL("image/jpeg", 0.85));
        setBusy(false);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid grid-cols-12 gap-x-6 py-12">
      <div className="col-span-12 md:col-span-2">
        <p className="label">
          Шаг
          <br />
          <span className="text-ink-900 font-medium tabular">01 / 02</span>
        </p>
      </div>

      <div className="col-span-12 md:col-span-10">
        <h2 className="font-display text-display-md font-light text-ink-900 mb-2">
          Загрузи <span className="italic text-ink-500">портрет</span>
        </h2>
        <p className="text-ink-600 mb-10 max-w-md">
          Дневной свет, без фильтров, лицо в фокусе. Фото обрабатывается локально
          и не сохраняется.
        </p>

        <motion.div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (e.dataTransfer.files[0]) resizeAndSet(e.dataTransfer.files[0]);
          }}
          animate={{
            borderColor: dragging ? "#7d3a2c" : "#cabfae"
          }}
          className="cursor-pointer card border-dashed min-h-[320px] flex items-center justify-center p-10 hover:border-ink-400 transition"
          style={{ borderStyle: "dashed" }}
        >
          <AnimatePresence mode="wait">
            {preview ? (
              <motion.img
                key="p"
                src={preview}
                alt="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-h-72 rounded-md"
              />
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <UploadGlyph />
                <p className="mt-4 text-ink-700 font-medium">
                  {dragging ? "Отпускай" : "Выбери файл или перетащи сюда"}
                </p>
                <p className="label mt-2">JPG · PNG · до 10 МБ</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && resizeAndSet(e.target.files[0])}
        />

        <AnimatePresence>
          {preview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setPreview(null);
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                  className="btn btn-ghost"
                >
                  Заменить
                </button>
                <button
                  onClick={() => preview && onUpload(preview)}
                  disabled={busy}
                  className="btn btn-primary flex-1"
                >
                  Дальше
                  <span aria-hidden>→</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function UploadGlyph() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="mx-auto text-ink-400">
      <path
        d="M12 16V4M12 4L7 9M12 4L17 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 16V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
