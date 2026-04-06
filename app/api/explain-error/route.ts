import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a friendly Python tutor helping a teenager who is learning to code for the first time. They have just seen an error in their code. Explain what went wrong in one short paragraph using simple everyday language with no technical jargon. Start by naming what kind of mistake it is in plain English for example you have a typo in a variable name or you are trying to use a number where Python expects text. Then explain in one sentence what caused it. Then give one specific hint about where in their code to look to fix it. Never use the words traceback, exception, runtime, syntax error, or any other Python-specific term. Never give the answer directly. End with one short encouraging sentence.`;

export async function POST(request: NextRequest) {
  try {
    const { code, rawError } = await request.json();

    if (!code || !rawError) {
      return NextResponse.json({ fallback: true }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Code:\n${code}\n\nError:\n${rawError}`,
        },
      ],
    });

    const block = message.content[0];
    if (block.type !== "text") {
      return NextResponse.json({ fallback: true });
    }

    return NextResponse.json({ explanation: block.text.trim() });
  } catch {
    return NextResponse.json({ fallback: true });
  }
}
