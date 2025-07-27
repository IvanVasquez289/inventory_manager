import { prisma } from "@/lib/db";
import { updateUserProfile } from "@/lib/services/profileService";
import { authenticate } from "@/middlewares/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (!auth.valid) return auth.response!;

  const userId = (auth.user as { id: number }).id;
//   Fetch user profile from the database except for the password
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const { password, ...userProfile } = user;
  return NextResponse.json(userProfile, { status: 200 });
}


export async function PUT(req: NextRequest) {
  try {
    const auth = await authenticate(req);
    if (!auth.valid) return auth.response!;

    const userId = (auth.user as { id: number }).id;

    const body = await req.json();

    const updatedUser = await updateUserProfile(userId, body);

    return NextResponse.json(updatedUser, { status: 200 });
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

    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}