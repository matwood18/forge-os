import { NextResponse } from "next/server";

import type { Question } from "@/lib/domain";
import { getKernel } from "@/lib/kernel/get-kernel";

export async function POST(request: Request) {
  const body = await request.json();

  const question = body.question as Question | undefined;
  const answer = typeof body.answer === "string" ? body.answer.trim() : "";

  if (!question) {
    return NextResponse.json({ error: "Question is required." }, { status: 400 });
  }

  if (!answer) {
    return NextResponse.json({ error: "Answer is required." }, { status: 400 });
  }

  if (answer === "__DIFFERENT_PERSON__") {
    return NextResponse.json({
      needsFollowUp: true,
      message: "Got it — different John. What’s his full name?",
      question,
    });
  }

  const forge = getKernel();
  const result = await forge.answerIdentityQuestion(question, answer);

  return NextResponse.json({
    needsFollowUp: false,
    ...result,
  });
}