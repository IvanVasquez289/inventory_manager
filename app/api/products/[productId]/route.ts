import { prisma } from "@/lib/db";
import { authenticate } from "@/middlewares/auth";
import { NextRequest, NextResponse } from "next/server";

interface ProductInput {
  name: string;
  description?: string;
  price: number
}
export async function GET(req: NextRequest,{ params }: { params: { productId: string } }) {
  // Authenticate the user
  const auth = await authenticate(req)
  if (!auth.valid) return auth.response!

  const {productId} = await params ;
  const id = Number(productId);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: { params: { productId: string } }) {
  const auth = await authenticate(req)
  if (!auth.valid) return auth.response!

  const {productId} = await params ;
  const id = Number(productId);
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

  const data: ProductInput = await req.json()
  const { name, description, price } = data

  if (!name || !price) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })
  }

  try {
    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        description: description || null,
        price,
      },
    })

    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json({ error: 'Error updating product' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { productId: string } }) {
  const auth = await authenticate(req)
  if (!auth.valid) return auth.response!

  const {productId} = await params ;
  const id = Number(productId);
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

  try {
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ message: 'Product deleted' }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: 'Error deleting product' }, { status: 500 })
  }
}
