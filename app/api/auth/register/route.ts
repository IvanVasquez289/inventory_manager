import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: RegisterBody = await request.json();

    const { name, email, password } = body;
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return NextResponse.json({ token }, { status: 201 });
  } catch (error) {
    console.error("Error in registration:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
