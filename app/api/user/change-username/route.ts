import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, username } = await req.json();

    if (!userId || !username) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Optional: check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 }
      );
    }

    // Update username
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { username },
    });

    return NextResponse.json({
      success: true,
      username: updatedUser.username,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Username update error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to update username" },
      { status: 500 }
    );
  }
}