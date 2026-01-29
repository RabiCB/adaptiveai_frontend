import { google } from "@/lib/googleAuthOptions";
import { lucia } from "@/lib/lucia";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  
  try {
    const url = req.nextUrl;
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code || !state) {
      console.error("Missing code or state parameter");
      return NextResponse.redirect(new URL("/login?error=missing_params", req.url));
    }

    const codeVerifier = cookieStore.get("google_code_verifier")?.value;
    const savedState = cookieStore.get("google_oauth_state")?.value;

    console.log("🔍 Cookie check:", {
      codeVerifier: codeVerifier ? "✅ Found" : "❌ Missing",
      savedState: savedState ? "✅ Found" : "❌ Missing",
    });

    if (!codeVerifier || !savedState) {
      console.error("Missing OAuth cookies");
      return NextResponse.redirect(new URL("/login?error=missing_cookies", req.url));
    }

    if (state !== savedState) {
      console.error("State mismatch");
      return NextResponse.redirect(new URL("/login?error=state_mismatch", req.url));
    }

    // Exchange code for tokens
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    const accessToken = tokens.accessToken();

    // Fetch user info
    const googleResponse = await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!googleResponse.ok) {
      console.error("Failed to fetch Google user info");
      return NextResponse.redirect(new URL("/login?error=fetch_failed", req.url));
    }

    const googleData = (await googleResponse.json()) as {
      id: string;
      email: string;
      name: string;
      picture: string;
    };

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: googleData.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          username: googleData.name,
          email: googleData.email,
          picture: googleData.picture,
          role: "USER",
        },
      });
      console.log("✅ New user created:", user.email);
    } else {
      console.log("✅ Existing user found:", user.email);
    }

    // Create Lucia session
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    // Clear OAuth cookies
    cookieStore.set("google_oauth_state", "", { maxAge: 0 });
    cookieStore.set("google_code_verifier", "", { maxAge: 0 });

    console.log("✅ Authentication successful");

    // Create redirect response with session cookie
    const response = NextResponse.redirect(new URL("/", req.url));
    
    // Set session cookie on response
    response.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return response;
    
  } catch (error) {
    console.error("❌ OAuth callback error:", error);
    
    // Clear cookies on error
    cookieStore.set("google_oauth_state", "", { maxAge: 0 });
    cookieStore.set("google_code_verifier", "", { maxAge: 0 });
    
    return NextResponse.redirect(new URL("/login?error=auth_failed", req.url));
  }
}