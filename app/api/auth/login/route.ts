import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/services/authService";
import { handleApiError } from "@/lib/handleApiError";
import { LoginBody } from "@/types";


export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: LoginBody = await request.json();
    const { email, password } = body;

    const token = await loginUser({ email, password });

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    return handleApiError(error)
  }
}
