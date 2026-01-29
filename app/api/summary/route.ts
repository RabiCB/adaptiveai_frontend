import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 6;

/* ================= SAVE SUMMARY ================= */

export async function POST(req: Request) {
  try {
    const { userId, title, content } = await req.json();

    if (!userId || !title || !content) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const summary = await prisma.savedSummaries.create({
      data: {
        userId,
        title,
        content,
      },
    });

    return NextResponse.json({ success: true, summary });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}



