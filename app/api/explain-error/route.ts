import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a friendly coding coach for teenagers learning Python for the first time.

When a learner's code throws an error, explain what went wrong in plain English.

Rules:
- Write exactly one short paragraph (2-3 sentences max)
- Use casual, encouraging language — never blame the learner
- Never use raw Python jargon (no "traceback", "exception", "stack", "stderr")
- Explain what the problem is and give a gentle hint about how to fix it
- If the error involves a variable name, mention the name
- End with something encouraging like "You've got this!" or "Give it another go!"`;

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
