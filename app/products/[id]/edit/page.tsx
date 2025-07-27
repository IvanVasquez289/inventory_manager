"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { axiosInstance } from "@/lib/axios";
import { Product } from "@/types";
import { AxiosError } from "axios";

const EditProductPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  const [product, setProduct] = useState<
    Pick<Product, "name" | "description" | "price">
  >({
    name: "",
    description: "",
    price: 0,
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchProduct = async () => {
      try {
        const { data } = await axiosInstance(`/products/${id}`);
        // Solo las propiedades necesarias para evitar errores
        setProduct({
          name: data.name,
          description: data.description,
          price: data.price,
        });
      } catch (err) {
        if (err instanceof AxiosError) {
          setMessage({
            type: "error",
            text: err.response?.data?.error || "Error al obtener el producto",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, token, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await axiosInstance.put(`/products/${id}`, product);
      setProduct({
        name: data.name,
        description: data.description,
        price: data.price,
      });
      setMessage({ type: "success", text: "Producto actualizado correctamente" });
    } catch (err) {
      if (err instanceof AxiosError) {
        setMessage({
          type: "error",
          text: err.response?.data?.error || "Error al actualizar el producto",
        });
      }
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="max-w-lg mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Editar producto</h1>

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
          <label className="block mb-1 font-medium">Nombre</label>
          <input
            type="text"
            name="name"
            className="w-full border p-2 rounded"
            value={product.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Descripción</label>
          <textarea
            name="description"
            className="w-full border p-2 rounded"
            value={product.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Precio</label>
          <input
            type="number"
            name="price"
            step="0.01"
            className="w-full border p-2 rounded"
            value={product.price}
            onChange={(e) =>
              setProduct({ ...product, price: parseFloat(e.target.value) || 0 })
            }
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
