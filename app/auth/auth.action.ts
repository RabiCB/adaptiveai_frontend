'use server'

import { z } from "zod";
import { formSchema } from "@/components/AuthenticationComp/Register";
import { loginSchema } from "@/components/AuthenticationComp/Login";
import { Argon2id } from "oslo/password";
import { lucia, validateRequest } from "@/lib/lucia";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { generateCodeVerifier, generateState } from "arctic";
import { google } from "@/lib/googleAuthOptions";
import { revalidatePath } from "next/cache";

// -------------------- Signup --------------------
export async function signup(values: z.infer<typeof formSchema>) {
  try {
    if (!values.email) {
      return { success: false, error: "Email is required" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: values.email.toLowerCase() },
    });

    if (existingUser) {
      return { success: false, error: "User already exists" };
    }

    const hashedPassword = await new Argon2id().hash(values.password);

    const user = await prisma.user.create({
      data: {
        username: values.username,
        email: values.email.toLowerCase(),
        hashedPassword,
        role: "USER",
      },
    });

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: "Failed to signup" };
  }
}

// -------------------- SignIn --------------------
export async function signIn(values: z.infer<typeof loginSchema>) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: values.email.toLowerCase() },
    });

    if (!user || !user.hashedPassword) {
      return { success: false, error: "Invalid credentials" };
    }

    const passwordMatch = await new Argon2id().verify(
      user.hashedPassword,
      values.password
    );

    if (!passwordMatch) {
      return { success: false, error: "Invalid credentials" };
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return { success: true };
  } catch (error) {
    console.error("SignIn error:", error);
    return { success: false, error: "Failed to sign in" };
  }
}

// -------------------- Logout --------------------
// export async function logout() {
//   try {
//     const { session } = await validateRequest();

//     if (!session) {
//       return { success: false, error: "No session found" };
//     }

//     await lucia.invalidateSession(session.id);

//     const sessionCookie = lucia.createBlankSessionCookie();
//     (await cookies()).set(
//       sessionCookie.name,
//       sessionCookie.value,
//       sessionCookie.attributes
//     );

//     return { success: true };
//   } catch (error) {
//     console.error("Logout error:", error);
//     return { success: false, error: "Failed to logout" };
//   }
// }

// -------------------- Get Google Auth URL --------------------
export async function getGoogleAuthUrl() {
  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    const cookieStore = await cookies();
    
    cookieStore.set("google_oauth_state", state, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10, // 10 minutes
      sameSite: "lax",
    });

    cookieStore.set("google_code_verifier", codeVerifier, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "lax",
    });

    const authUrl = await google.createAuthorizationURL(state, codeVerifier, [
        "openid",
        "email",
        "profile",
    ]);

    return { success: true, url: authUrl.toString() };
  } catch (error) {
    console.error("Google Auth URL error:", error);
    return { success: false, error: "Failed to get Google auth URL" };
  }
}


export async function logout() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value;

  if (sessionId) {
    await lucia.invalidateSession(sessionId);
  }

  cookieStore.delete(lucia.sessionCookieName);

  redirect("/auth/login"); // ✅ triggers middleware
}


export async function getCurrentUser() {
  const sessionId =
    (await cookies()).get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) return null;

  const { user, session } = await lucia.validateSession(sessionId);

  if (!session || !user) {
    const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value;

  if (sessionId) {
    await lucia.invalidateSession(sessionId);
  }

  cookieStore.delete(lucia.sessionCookieName);

  redirect("/auth/login");
  return null
  };

  return prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      username: true,
      picture: true,
      role: true,
    },
  });
}