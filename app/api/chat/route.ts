import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY не задан" }, { status: 500 });
  }

  try {
    const { messages, result } = await req.json();
    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: "no messages" }, { status: 400 });
    }

    const systemPrompt = `Ты — персональный колорист и стилист пользователя в приложении Smile. Отвечай по-русски, дружелюбно, кратко и по делу (2–5 предложений). Опирайся на результат цветотип-анализа ниже.

Если спрашивают про конкретные цвета, вещи, макияж — давай практические рекомендации с привязкой к палитре. Если вопрос вне твоей экспертизы (например, политика, медицина) — мягко перенаправь к теме внешности и стиля.

Результат анализа пользователя:
${JSON.stringify(result, null, 2)}`;

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.7,
      messages: [{ role: "system", content: systemPrompt }, ...messages]
    });

    const reply = response.choices[0]?.message?.content ?? "";
    return NextResponse.json({ reply });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
