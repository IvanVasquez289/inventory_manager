import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/services/authService";

interface LoginBody {
  email: string;
  password: string;
}
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: LoginBody = await request.json();
    const { email, password } = body;

    const token = await loginUser({ email, password });

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      "status" in error
    ) {
      const err = error as { message: string; status: number };
      return NextResponse.json({ error: err.message }, { status: err.status });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
