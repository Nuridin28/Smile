import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY не задан" }, { status: 500 });
  }
  try {
    const { result, swatches } = await req.json();
    if (!Array.isArray(swatches) || swatches.length < 2) {
      return NextResponse.json({ error: "нужно минимум 2 цвета" }, { status: 400 });
    }

    const colorList = swatches
      .map((s: { hex: string; name: string }) => `${s.name} (${s.hex})`)
      .join(", ");

    const systemPrompt = `Ты — персональный колорист и стилист. Дай короткое (3–4 предложения) экспертное мнение о комбинации цветов в контексте цветотипа пользователя.

Отвечай по-русски, конкретно и практично:
1) Работает ли комбо
2) Для какого случая (повседнев / офис / вечер)
3) Что дополнить (нейтральная база, аксессуары)

Не начинай с "Эта комбинация" или общих фраз. Сразу к сути.

Цветотип пользователя:
${JSON.stringify(result, null, 2)}`;

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Оцени комбо из цветов: ${colorList}` }
      ]
    });

    return NextResponse.json({ reply: response.choices[0]?.message?.content ?? "" });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "unknown" },
      { status: 500 }
    );
  }
}
