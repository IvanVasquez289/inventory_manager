import { authenticate } from "@/middlewares/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    const auth = await authenticate(req)
    if(!auth.valid) return auth.response!

    console.log(auth.user)
    const userId = (auth.user as { id: number }).id;
    console.log(userId);
    return NextResponse.json({name:"John Doe"})
}