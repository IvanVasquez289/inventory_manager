import { prisma } from "@/lib/db";
import { LoginBody, RegisterBody } from "@/types";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET || "";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET no está configurado");
}

export const AuthErrors = {
  MISSING_FIELDS: { message: "Email and password are required", status: 400 },
  INVALID_EMAIL: { message: "Invalid email format", status: 400 },
  USER_NOT_FOUND: { message: "User not found", status: 404 },
  INVALID_PASSWORD: { message: "Invalid password", status: 401 },
  INTERNAL_ERROR: { message: "Internal Server Error", status: 500 },
  EMAIL_IN_USE: { message: "Email is already in use", status: 409 },
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export async function loginUser({ email, password }: LoginBody) {
  if (!email || !password) {
    throw AuthErrors.MISSING_FIELDS;
  }

  if(email.trim() === "" || password.trim() === "") {
    throw AuthErrors.MISSING_FIELDS;
  }
  
  if (!emailRegex.test(email)) {
    throw AuthErrors.INVALID_EMAIL;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw AuthErrors.USER_NOT_FOUND;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw AuthErrors.INVALID_PASSWORD;
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "2d",
  });

  return token;
}

export async function registerUser({ name, email, password }: RegisterBody) {
  if (!name || !email || !password || name.trim() === "" || email.trim() === "" || password.trim() === "") {
    throw AuthErrors.MISSING_FIELDS;
  }

  if (!emailRegex.test(email)) {
    throw AuthErrors.INVALID_EMAIL;
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw AuthErrors.EMAIL_IN_USE;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
}