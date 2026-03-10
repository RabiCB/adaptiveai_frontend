import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Argon2id } from "oslo/password";
import { validateRequest } from "@/lib/lucia";

export async function POST(req: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser || !dbUser.hashedPassword) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const validPassword = await new Argon2id().verify(
      dbUser.hashedPassword,
      currentPassword
    );

    if (!validPassword) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    const newHashedPassword = await new Argon2id().hash(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        hashedPassword: newHashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error: any) {
    console.error("Password change error:", error);

    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    );
  }
}