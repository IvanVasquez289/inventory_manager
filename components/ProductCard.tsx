import { useProductStore } from "@/store/useProductStore";
import Link from "next/link";
import { axiosInstance } from "@/lib/axios";
import { Product } from "@/types";

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const products = useProductStore((state) => state.products);
  const setProducts = useProductStore((state) => state.setProducts);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("¿Estás seguro de que quieres eliminar este producto?");
    if (!confirmed) return;

    try {
      await axiosInstance.delete(`/products/${id}`);
      alert("Producto eliminado con éxito");
      // Actualizar el store removiendo el producto eliminado
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el producto");
    }
  };

  return (
    <li className="border p-4 shadow-sm bg-white rounded">
      <h2 className="text-xl font-semibold">{product.name}</h2>
      <p>{product.description || "Sin descripción"}</p>
      <p className="text-green-600 font-medium">${product.price}</p>
      <p className="text-sm text-gray-500">
        Creado: {new Date(product.createdAt).toLocaleDateString()}
      </p>
      <div className="mt-2 flex gap-4">
        <Link
          href={`/products/${product.id}/edit`}
          className="text-yellow-600 hover:underline"
        >
          Edit
        </Link>
        <button
          onClick={() => handleDelete(product.id)}
          className="text-red-600 hover:underline cursor-pointer"
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default ProductCard;
