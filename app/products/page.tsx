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
  const [errorMessage, setErrorMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; // productos por página

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`/products?page=${page}&limit=${limit}`);
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (error) {
        if (error instanceof AxiosError) {
          setErrorMessage({
            type: "error",
            text: error.response?.data?.error || "Error loading products",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token, router, setProducts, page]);

  if (loading) return <div>Cargando productos...</div>;
  if (errorMessage) return <div className="text-red-600">Error: {errorMessage.text}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold mb-4">Mis productos</h1>
        <Link href="/products/new" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Crear producto
        </Link>
      </div>
      {products.length === 0 ? (
        <p>No tienes productos aún.</p>
      ) : (
        <>
          <ul className="space-y-4 sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ul>

          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span>
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductsPage;
