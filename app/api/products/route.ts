import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authenticate } from "@/middlewares/auth";

interface ProductInput {
  name: string;
  description?: string;
  price: number
}

// Obtener productos del usuario autenticado
export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (!auth.valid) return auth.response!;

  const userId = (auth.user as { id: number }).id;

  try {
    const products = await prisma.product.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching products" }, { status: 500 });
  }
}

// Crear producto
export async function POST(req: NextRequest) {
  const auth = await authenticate(req);
  if (!auth.valid) return auth.response!;

  const userId = (auth.user as { id: number }).id;
  const data: ProductInput = await req.json();
  const { name, description, price } = data;

  if (!name || !price || price <= 0 || name.trim() === "") {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
    
  }

  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price, 
        userId
      },
    });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error creating product" }, { status: 500 });
  }
}