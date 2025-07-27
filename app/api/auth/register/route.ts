import { registerUser } from "@/lib/services/authService";
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
    const token = await registerUser({ name, email, password });

    return NextResponse.json({ token }, { status: 201 });
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
