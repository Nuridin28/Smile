export type Family = "Spring" | "Summer" | "Autumn" | "Winter";

export type SeasonData = {
  name: string;
  family: Family;
  traits: string;
  description: string;
  palette: string[];
};

export const SEASONS: SeasonData[] = [
  {
    name: "Bright Spring",
    family: "Spring",
    traits: "тёплый · контрастный · яркий",
    description: "Чистые сияющие тёплые цвета. Кожа фарфоровая или золотистая, глаза яркие, волосы — от золотистых до тёмно-каштановых.",
    palette: ["#ff6b4a", "#ffd23f", "#2dd4bf", "#ec4899", "#65a30d", "#fb923c"]
  },
  {
    name: "Warm Spring",
    family: "Spring",
    traits: "тёплый · средний контраст · золотистый",
    description: "Мягкое тёплое золото — ничего ледяного и чёрного. Натуральные блонды и рыжие, веснушки.",
    palette: ["#fb923c", "#d97706", "#65a30d", "#ef4444", "#fef3c7", "#b45309"]
  },
  {
    name: "Light Spring",
    family: "Spring",
    traits: "тёплый · лёгкий · светлый",
    description: "Светлые тёплые пастели. Бледная кожа с золотистым подтоном, светло-русые волосы.",
    palette: ["#fed7aa", "#bbf7d0", "#fef3c7", "#fda4af", "#a5f3fc", "#fde68a"]
  },
  {
    name: "Light Summer",
    family: "Summer",
    traits: "холодный · лёгкий · мягкий",
    description: "Прохладные пастельные оттенки. Светлая кожа с розовым подтоном, пепельный блонд.",
    palette: ["#bae6fd", "#ddd6fe", "#fbcfe8", "#e0f2fe", "#c7d2fe", "#fce7f3"]
  },
  {
    name: "Cool Summer",
    family: "Summer",
    traits: "холодный · средний контраст · приглушённый",
    description: "Чистые холодные оттенки средней насыщенности. Розоватая кожа, серо-голубые глаза.",
    palette: ["#f9a8d4", "#94a3b8", "#86efac", "#1e3a8a", "#a78bfa", "#6b21a8"]
  },
  {
    name: "Soft Summer",
    family: "Summer",
    traits: "холодный · мягкий · дымчатый",
    description: "Приглушённые холодные тона: сложные, как пыль на витрине. Нейтрально-русые волосы.",
    palette: ["#c4b5fd", "#5eead4", "#a8a29e", "#9f1239", "#84cc16", "#818cf8"]
  },
  {
    name: "Soft Autumn",
    family: "Autumn",
    traits: "тёплый · мягкий · приглушённый",
    description: "Тёплая земля без яркости. Мягкие шалфейные и охристые. Орехово-зелёные глаза.",
    palette: ["#a3a392", "#65737e", "#c87854", "#5d8a89", "#b08968", "#c2978f"]
  },
  {
    name: "Warm Autumn",
    family: "Autumn",
    traits: "тёплый · насыщенный · земляной",
    description: "Богатая палитра специй: горчица, корица, ржавчина. Яркие рыжие или каштановые волосы.",
    palette: ["#ea580c", "#ca8a04", "#4d7c0f", "#b91c1c", "#c2410c", "#92400e"]
  },
  {
    name: "Deep Autumn",
    family: "Autumn",
    traits: "тёплый · глубокий · контрастный",
    description: "Глубокие тёплые оттенки леса и драгоценных камней. Тёмные волосы и глаза, тёплый подтон.",
    palette: ["#c2410c", "#134e4a", "#7c2d12", "#14532d", "#581c87", "#a16207"]
  },
  {
    name: "Deep Winter",
    family: "Winter",
    traits: "холодный · глубокий · контрастный",
    description: "Драматический контраст светлой кожи и тёмных волос. Чистые холодные глубокие цвета.",
    palette: ["#1e293b", "#1e3a8a", "#581c87", "#be185d", "#047857", "#b91c1c"]
  },
  {
    name: "Cool Winter",
    family: "Winter",
    traits: "холодный · ясный · чистый",
    description: "Холодная палитра без тепла. Розоватая кожа, серо-голубые или сине-зелёные глаза.",
    palette: ["#f8fafc", "#1e40af", "#7e22ce", "#db2777", "#047857", "#b91c1c"]
  },
  {
    name: "Bright Winter",
    family: "Winter",
    traits: "холодный · контрастный · яркий",
    description: "Электрические чистые цвета. Высокий контраст светлой кожи и тёмных волос с холодным подтоном.",
    palette: ["#f8fafc", "#2563eb", "#ec4899", "#10b981", "#facc15", "#1d4ed8"]
  }
];

export const FAMILY_PALETTES: Record<Family, string[]> = {
  Spring: ["#fed7aa", "#fb923c", "#ffd23f", "#65a30d", "#ec4899"],
  Summer: ["#cdd9d4", "#9fb6b2", "#a78bfa", "#f9a8d4", "#1e3a8a"],
  Autumn: ["#e8c79c", "#c89968", "#a06b3e", "#73411f", "#3f2415"],
  Winter: ["#d8d3da", "#1e293b", "#be185d", "#047857", "#facc15"]
};

export function findSeason(name: string): SeasonData | undefined {
  return SEASONS.find((s) => s.name === name);
}

export function siblingSeasons(name: string): SeasonData[] {
  const me = findSeason(name);
  if (!me) return [];
  return SEASONS.filter((s) => s.family === me.family && s.name !== me.name);
}

export function familyOf(name: string): Family | undefined {
  return findSeason(name)?.family;
}

export function seasonsInFamily(family: Family): SeasonData[] {
  return SEASONS.filter((s) => s.family === family);
}
