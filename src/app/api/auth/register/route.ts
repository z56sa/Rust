import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "الرجاء إدخال البريد الإلكتروني وكلمة المرور" }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const existing = await db.select().from(users).where(eq(users.email, trimmedEmail)).limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ error: "البريد الإلكتروني مسجل بالفعل" }, { status: 400 });
    }

    const id = "user_" + Date.now();
    const passwordHash = hashPassword(password);
    // Sole admin assignment: hi423179@gmail.com is exclusively admin
    const role = trimmedEmail === "hi423179@gmail.com" ? "admin" : "user";
    const userName = name?.trim() || (trimmedEmail === "hi423179@gmail.com" ? "المدير العام" : "مستخدم جديد");

    await db.insert(users).values({
      id,
      email: trimmedEmail,
      passwordHash,
      name: userName,
      role,
    });

    const sessionData = {
      id,
      email: trimmedEmail,
      name: userName,
      role,
    };

    const response = NextResponse.json({
      success: true,
      user: sessionData,
      message: "تم إنشاء الحساب بنجاح",
    });

    response.cookies.set("user_session", JSON.stringify(sessionData), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء إنشاء الحساب" }, { status: 500 });
  }
}
