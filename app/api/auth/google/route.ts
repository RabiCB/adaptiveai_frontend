// app/api/auth/google/route.ts
import { google } from "@/lib/googleAuthOptions";
import { generateState, generateCodeVerifier } from "arctic";
import { NextResponse } from "next/server";



export async function GET() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const scopes = ["openid", "profile", "email"];
  const url = await google.createAuthorizationURL(state, codeVerifier, scopes);

  const response = NextResponse.redirect(url);


  console.log(response,"skskkskkskksks")
  // 🔥 MUST be on response
  response.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // localhost
    path: "/",
    maxAge: 600
  });

  response.cookies.set("google_code_verifier", codeVerifier, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 600
  });

    return response;
  
}
