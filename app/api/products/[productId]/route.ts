import { handleApiError } from "@/lib/handleApiError";
import { deleteProduct, getProductById, updateProduct } from "@/lib/services/productService";
import { authenticate } from "@/middlewares/auth";
import { ProductInput } from "@/types";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  // Authenticate the user
  const auth = await authenticate(req);
  if (!auth.valid) return auth.response!;

  const { productId } = await params;
  const id = Number(productId);

  try {
    const product = await getProductById(id);
    return NextResponse.json(product);
  } catch(error) {
    return handleApiError(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const auth = await authenticate(req);
  if (!auth.valid) return auth.response!;

  const { productId } = await params;
  const id = Number(productId);
 
  const data: ProductInput = await req.json();

  try {
    const updated = await updateProduct(id, data);
    return NextResponse.json(updated);
  } catch(  error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const auth = await authenticate(req);
  if (!auth.valid) return auth.response!;

  const { productId } = await params;
  const id = Number(productId);

  try {
    await deleteProduct(id);
    return NextResponse.json({ message: "Product deleted" }, { status: 200 });
  } catch(error) {
    return handleApiError(error);
  }
}
