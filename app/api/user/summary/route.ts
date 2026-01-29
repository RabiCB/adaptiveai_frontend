import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 6;

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


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const userId = req.headers.get("x-user-id");
    
    const page = Number(searchParams.get("page") || "1");

    if (!userId) {
      return NextResponse.json({ error: "User ID missing" }, { status: 400 });
    }

    const skip = (page - 1) * PAGE_SIZE;

    const [summaries, total] = await Promise.all([
      prisma.savedSummaries.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: PAGE_SIZE,
        skip,
      }),
      prisma.savedSummaries.count({
        where: { userId },
      }),
    ]);

    return NextResponse.json({
      summaries,
      pagination: {
        total,
        page,
        pageSize: PAGE_SIZE,
        totalPages: Math.ceil(total / PAGE_SIZE),
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch summaries" },
      { status: 500 }
    );
  }
}

/* ================= DELETE SUMMARY ================= */

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const summaryId = searchParams.get("id");
    const userId = req.headers.get("x-user-id");

    if (!summaryId) {
      return NextResponse.json(
        { error: "Summary ID missing" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User ID missing" },
        { status: 400 }
      );
    }

    // Check if summary exists and belongs to the user
    const summary = await prisma.savedSummaries.findUnique({
      where: { id: summaryId },
    });

    if (!summary) {
      return NextResponse.json(
        { error: "Summary not found" },
        { status: 404 }
      );
    }

    if (summary.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Delete the summary
    await prisma.savedSummaries.delete({
      where: { id: summaryId },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Summary deleted successfully" 
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Failed to delete summary" },
      { status: 500 }
    );
  }
}