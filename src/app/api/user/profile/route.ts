import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("user_session");
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "يجب تسجيل الدخول أولاً" }, { status: 401 });
    }

    const session = JSON.parse(decodeURIComponent(sessionCookie.value));
    const userId = session.id;

    const { name, avatar } = await req.json();

    const updateData: { name?: string; avatar?: string } = {};
    if (name && typeof name === "string" && name.trim()) {
      updateData.name = name.trim();
    }
    if (avatar && typeof avatar === "string") {
      updateData.avatar = avatar.trim();
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "لا توجد بيانات للتعديل" }, { status: 400 });
    }

    await db.update(users).set(updateData).where(eq(users.id, userId));

    // Update cookie
    const updatedSession = {
      ...session,
      ...(updateData.name ? { name: updateData.name } : {}),
      ...(updateData.avatar ? { avatar: updateData.avatar } : {}),
    };

    const response = NextResponse.json({
      success: true,
      user: updatedSession,
      message: "تم تحديث البيانات بنجاح",
    });

    response.cookies.set("user_session", JSON.stringify(updatedSession), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
