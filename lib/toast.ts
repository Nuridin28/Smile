export type ToastEvent = { message: string };

export function toast(message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<ToastEvent>("smile-toast", { detail: { message } }));
}

export async function copyHex(hex: string) {
  try {
    await navigator.clipboard.writeText(hex);
    toast(`${hex.toUpperCase()} скопирован`);
  } catch {
    toast("Не удалось скопировать");
  }
}
