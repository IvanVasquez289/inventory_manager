"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { AxiosError } from "axios";
import ProductCard from "@/components/ProductCard";
import { useProductStore } from "@/store/useProductStore";
import Link from "next/link";



const ProductsPage = () => {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const products = useProductStore((state) => state.products);
  const setProducts = useProductStore((state) => state.setProducts);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchProducts = async () => {
      try {
        const { data } = await axiosInstance("/products");
        setProducts(data);
      } catch (error) {
        if (error instanceof AxiosError) {
          setErrorMessage({
            type: "error",
            text: error.response?.data?.error || "Error loading profile",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token, router, setProducts]);

  if (loading) return <div>Cargando productos...</div>;
  if (errorMessage)
    return <div className="text-red-600">Error: {errorMessage.text}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold mb-4">Mis productos</h1>
        <Link href="/products/new" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Crear producto</Link>
      </div>
      {products.length === 0 ? (
        <p>No tienes productos aún.</p>
      ) : (
        <ul className="space-y-4 sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductsPage;
