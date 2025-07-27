import { NextResponse } from "next/server";

export function handleApiError(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    const err = error as { message: string; status?: number };
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }

  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
