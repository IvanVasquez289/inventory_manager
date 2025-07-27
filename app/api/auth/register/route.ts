import { handleApiError } from "@/lib/handleApiError";
import { registerUser } from "@/lib/services/authService";
import { RegisterBody } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: RegisterBody = await request.json();

    const { name, email, password } = body;
    const token = await registerUser({ name, email, password });

    return NextResponse.json({ token }, { status: 201 });
  } catch (error) {
    return handleApiError(error)
  }
}
