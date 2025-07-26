import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

interface LoginBody {
  email: string;
  password: string;
}
export async function POST(request: NextRequest){
    try {
        const body: LoginBody = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({where: { email }});
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
            expiresIn: "1h",
        });

        return NextResponse.json({ token }, { status: 200 });
    
        
    } catch (error) {
        console.error("Error in login", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}