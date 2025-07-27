"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProductsPage = () => {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) {
      router.push("/login")
    }
  }, [token, router]);

  return <div>ProductsPage</div>;
};

export default ProductsPage;
