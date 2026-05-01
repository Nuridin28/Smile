export type Questionnaire = {
  eyeColor: string;
  hairColor: string;
  sunReaction: string;
  preferences?: string;
};

export type Swatch = { hex: string; name: string };

export type AnalysisResult = {
  season: string;
  undertone: "warm" | "cool" | "neutral";
  contrast: "low" | "medium" | "high";
  saturation: "soft" | "clear";
  palette: Swatch[];
  avoid: Swatch[];
  metals: ("gold" | "silver" | "rose-gold")[];
  makeup: { day: string; evening: string };
  explanation: string;
};

export type ChatMessage = { role: "user" | "assistant"; content: string };
