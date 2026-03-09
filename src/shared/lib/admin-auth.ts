import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/shared/lib/prisma";
import { checkRateLimit } from "@/shared/lib/rate-limit";
import { verifyPassword } from "@/shared/lib/password";

const ADMIN_COOKIE_NAME = "ws_admin_session";

function getSessionToken(): string {
  const token = process.env.ADMIN_SESSION_TOKEN;
  if (token) {
    return token;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SESSION_TOKEN is required in production.");
  }

  return "welcome-sudak-admin-dev-session";
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

type LoginAdminResult =
  | { ok: true }
  | {
      ok: false;
      reason: "invalid_credentials" | "rate_limited" | "not_configured";
      message: string;
    };

export async function loginAdmin(password: string, ip = "unknown"): Promise<LoginAdminResult> {
  const throttle = checkRateLimit(`admin-login:${ip}`, 6, 10 * 60 * 1000);
  if (!throttle.allowed) {
    return {
      ok: false,
      reason: "rate_limited",
      message: `Слишком много попыток входа. Повторите через ${throttle.retryAfterSeconds} сек.`,
    };
  }

  const adminUser = await prisma.adminUser.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      passwordHash: true,
    },
  });

  if (!adminUser) {
    if (process.env.NODE_ENV === "production") {
      return {
        ok: false,
        reason: "not_configured",
        message: "Администратор не настроен. Создайте AdminUser в базе данных.",
      };
    }

    const devPassword = process.env.ADMIN_PASSWORD;
    if (!devPassword) {
      return {
        ok: false,
        reason: "not_configured",
        message: "Для локального входа укажите ADMIN_PASSWORD или создайте AdminUser в БД.",
      };
    }
    if (password !== devPassword) {
      return {
        ok: false,
        reason: "invalid_credentials",
        message: "Неверный пароль.",
      };
    }
  } else {
    const valid = await verifyPassword(password, adminUser.passwordHash);
    if (!valid) {
      return {
        ok: false,
        reason: "invalid_credentials",
        message: "Неверный пароль.",
      };
    }

    console.info(`[admin-auth] successful login for ${adminUser.email}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, getSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return { ok: true };
}

export async function logoutAdmin(): Promise<void> {
  console.info("[admin-auth] logout");
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
