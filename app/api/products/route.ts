import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/middlewares/auth";
import { createProduct, getUserProducts } from "@/lib/services/productService";
import { handleApiError } from "@/lib/handleApiError";

interface ProductInput {
  name: string;
  description?: string;
  price: number;
}

// Obtener productos del usuario autenticado
export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (!auth.valid) return auth.response!;

  const userId = (auth.user as { id: number }).id;

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const search = searchParams.get("search") || "";

  try {
    const products = await getUserProducts(userId, page, limit, search);
    return NextResponse.json(products);
  } catch (error) {
    return handleApiError(error);
  }
}

// Crear producto
export async function POST(req: NextRequest) {
  const auth = await authenticate(req);
  if (!auth.valid) return auth.response!;

  const userId = (auth.user as { id: number }).id;
  const data: ProductInput = await req.json();

  try {
    const newProduct = await createProduct(data, userId);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
