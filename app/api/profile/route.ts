import { prisma } from "@/lib/db";
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
