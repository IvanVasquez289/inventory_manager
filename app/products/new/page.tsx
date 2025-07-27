"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { axiosInstance } from "@/lib/axios";
import { Product } from "@/types";
import { AxiosError } from "axios";

const NewProductPage = () => {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  const [product, setProduct] = useState<
    Pick<Product, "name" | "description" | "price">
  >({
    name: "",
    description: "",
    price: 0,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await axiosInstance.post("/products", product);
      setMessage({ type: "success", text: "Producto creado correctamente" });
      setProduct({ name: "", description: "", price: 0 });
      router.push("/products"); // Redirigir a la lista de productos después de crear
    } catch (err) {
      if (err instanceof AxiosError) {
        setMessage({
          type: "error",
          text: err.response?.data?.error || "Error al crear el producto",
        });
      } else {
        setMessage({
          type: "error",
          text: "Error desconocido al crear el producto",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Nuevo producto</h1>

      {message && (
        <div
          className={`mb-4 p-3 rounded text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            className="w-full border p-2 rounded"
            placeholder="E.g. Product 1"
            value={product.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            className="w-full border p-2 rounded"
            value={product.description}
            placeholder="E.g. Product 1 description"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Price</label>
          <input
            type="number"
            name="price"
            step="0.01"
            className="w-full border p-2 rounded"
            value={product.price}
            onChange={(e) =>
              setProduct({ ...product, price: parseFloat(e.target.value) || 0 })
            }
            min={0}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creando..." : "Crear producto"}
        </button>
      </form>
    </div>
  );
};

export default NewProductPage;
