import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export interface AuthResult {
  valid: boolean;
  user?: JwtPayload | string;
  response?: NextResponse;
}

export async function authenticate(req: NextRequest): Promise<AuthResult> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      valid: false,
      response: NextResponse.json({ error: "No token provided" }, { status: 401 }),
    };
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    return { valid: true, user: decoded };
  } catch (error) {
    return {
      valid: false,
      response: NextResponse.json({ error: "Invalid token" }, { status: 403 }),
    };
  }
}
