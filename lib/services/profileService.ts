import { prisma } from "@/lib/db";

interface UpdateProfileBody {
  name?: string;
  email?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ProfileErrors = {
  MISSING_FIELDS: { message: "Name or email is required", status: 400 },
  INVALID_EMAIL: { message: "Invalid email format", status: 400 },
  USER_NOT_FOUND: { message: "User not found", status: 404 },
  EMAIL_IN_USE: { message: "Email is already in use", status: 409 },
  INTERNAL_ERROR: { message: "Internal Server Error", status: 500 },
};

export async function updateUserProfile(userId: number, data: UpdateProfileBody) {
  const { name, email } = data;

  if (!name || !email) {
    throw ProfileErrors.MISSING_FIELDS;
  }

  if(name.trim() === "" || email.trim() === "") {
    throw ProfileErrors.MISSING_FIELDS;
  }

  if (email && !emailRegex.test(email)) {
    throw ProfileErrors.INVALID_EMAIL;
  }

  // Validar que email no esté en uso por otro usuario
  if (email) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser && existingUser.id !== userId) {
      throw ProfileErrors.EMAIL_IN_USE;
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      email,
    }
  })

  if (!updatedUser) {
    throw ProfileErrors.USER_NOT_FOUND;
  }

  return updatedUser;
}
