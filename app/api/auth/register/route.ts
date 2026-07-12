import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/validators/auth";
import { hashPassword } from "@/lib/hash";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  // Step 1: parse + validate
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

    // Step 2: check duplicate email
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }

    // Step 3: hash password
    const hash = await hashPassword(password);

    // Step 4: create user (select ปลอดภัย ไม่คืน password)
    const user = await prisma.user.create({
      data: {
        email,
        password: hash,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    // Step 5: return success
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
