import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_COOKIE_NAME = "ws_admin_session";

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "admin123";
}

function getSessionToken(): string {
  return process.env.ADMIN_SESSION_TOKEN ?? "welcome-sudak-admin-session";
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE_NAME)?.value === getSessionToken();
}

export async function requireAdminSession(): Promise<void> {
  const hasSession = await isAdminAuthenticated();
  if (!hasSession) {
    redirect("/admin");
  }
}

export async function loginAdmin(password: string): Promise<boolean> {
  if (password !== getAdminPassword()) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, getSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return true;
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
