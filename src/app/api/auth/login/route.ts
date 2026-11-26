import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password, rememberMe } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "الرجاء إدخال البريد الإلكتروني وكلمة المرور" }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const userList = await db.select().from(users).where(eq(users.email, trimmedEmail)).limit(1);

    if (userList.length === 0) {
      return NextResponse.json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, { status: 401 });
    }

    const user = userList[0];
    const isValid = verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, { status: 401 });
    }

    // Is admin check: if email is hi423179@gmail.com, role is admin
    const isAdmin = user.role === "admin" || user.email === "hi423179@gmail.com";

    const sessionData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: isAdmin ? "admin" : "user",
      avatar: user.avatar || "/avatars/02.png",
    };

    const response = NextResponse.json({
      success: true,
      user: sessionData,
      message: "تم تسجيل الدخول بنجاح",
    });

    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24; // 30 days or 1 day
    response.cookies.set("user_session", JSON.stringify(sessionData), {
      httpOnly: false, // Accessible to client-side header
      secure: process.env.NODE_ENV === "production",
      maxAge,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
