import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `Ты — профессиональный колорист и визажист с 15-летним опытом, эксперт по 12-сезонной системе цветотипов (Color Me Beautiful / Sci\\ART).

Твоя задача — проанализировать фото лица пользователя и его анкету, чтобы определить:
1. Подтон кожи: warm (тёплый, желтоватый/золотистый/персиковый), cool (холодный, розоватый/голубоватый), neutral (нейтральный).
2. Уровень контраста между кожей, глазами и волосами: low / medium / high.
3. Насыщенность: soft (мягкая, приглушённая) или clear (яркая, чистая).
4. Сезон в 12-сезонной системе. Используй ТОЛЬКО эти значения:
   - "Bright Winter", "Cool Winter", "Deep Winter"
   - "Cool Summer", "Light Summer", "Soft Summer"
   - "Soft Autumn", "Warm Autumn", "Deep Autumn"
   - "Light Spring", "Warm Spring", "Bright Spring"

Дай практичные рекомендации:
- Палитра из 12 цветов одежды с hex и русским названием.
- 6 цветов, которых стоит избегать (тоже hex + название).
- Подходящие металлы: gold, silver, rose-gold (один или несколько).
- Идеи макияжа на день и вечер (тон кожи, румяна, помада, тени, акценты).

Если фото плохого качества или лица не видно — всё равно сделай разумную оценку на основе анкеты, но укажи это в explanation.

Отвечай по-русски. Возвращай СТРОГО валидный JSON, без markdown-обёрток.`;

const SCHEMA_HINT = `Схема ответа (строго):
{
  "season": "Soft Autumn",
  "undertone": "warm" | "cool" | "neutral",
  "contrast": "low" | "medium" | "high",
  "saturation": "soft" | "clear",
  "palette": [{"hex": "#A67B5B", "name": "тёплая охра"}, ... 12 штук],
  "avoid": [{"hex": "#000000", "name": "чёрный"}, ... 6 штук],
  "metals": ["gold"],
  "makeup": {
    "day": "Тон в тёплых бежевых оттенках, персиковые румяна, ...",
    "evening": "Тёплая бронза на веках, помада терракотового оттенка, ..."
  },
  "explanation": "2-4 предложения: почему именно этот сезон, на какие признаки опирался"
}`;

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY не задан" }, { status: 500 });
  }

  try {
    const { image, questionnaire } = await req.json();
    if (!image || typeof image !== "string") {
      return NextResponse.json({ error: "no image" }, { status: 400 });
    }

    const userText = `Анкета пользователя:
- Цвет глаз: ${questionnaire?.eyeColor ?? "—"}
- Натуральный цвет волос: ${questionnaire?.hairColor ?? "—"}
- Реакция кожи на солнце: ${questionnaire?.sunReaction ?? "—"}
- Предпочтения по стилю: ${questionnaire?.preferences || "не указаны"}

${SCHEMA_HINT}`;

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      temperature: 0.4,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: userText },
            { type: "image_url", image_url: { url: image, detail: "high" } }
          ]
        }
      ]
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("пустой ответ от модели");

    const result = JSON.parse(content);
    return NextResponse.json(result);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
