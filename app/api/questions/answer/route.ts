import { NextResponse } from "next/server";

import type { Question } from "@/lib/domain";
import { getKernel } from "@/lib/kernel/get-kernel";

export async function POST(request: Request) {
  const body = await request.json();

  const question = body.question as Question | undefined;
  const answer = typeof body.answer === "string" ? body.answer : "";

  if (!question) {
    return NextResponse.json(
      { error: "Question is required." },
      { status: 400 }
    );
  }

  if (!answer.trim()) {
    return NextResponse.json(
      { error: "Answer is required." },
      { status: 400 }
    );
  }

  const forge = getKernel();

  const result = await forge.answerIdentityQuestion(question, answer);

  return NextResponse.json(result);
}