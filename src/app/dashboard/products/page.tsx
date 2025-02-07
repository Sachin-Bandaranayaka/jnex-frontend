"use client";

import { useState, useEffect } from "react";
import { Product } from "@/interfaces/interfaces";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import ProductDashboard from "@/components/ProductDashboard";
import { useAuth } from "@/context/authContext";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/api/products");
      // Check if response.data is an array, if not, check if it's nested
      const productsData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      setProducts(productsData);
      console.log("Products data:", productsData); // Debug log
    } catch (err: any) {
      console.error("Failed to fetch products:", err);
      if (err.response?.status === 401) {
        // router.push('/login');
      } else {
        setError(err.message || "Failed to fetch products. Please try again.");
      }
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProductUpdate = async (
    productData: Partial<Product>,
    productId?: string
  ) => {
    try {
      if (productId) {
        await api.put(`/api/products/${productId}`, productData);
      } else {
        await api.post("/api/products", productData);
      }
      await fetchProducts();
      return true;
    } catch (error) {
      console.error("Error saving product:", error);
      setError("Failed to save product");
      return false;
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Please log in to view products</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <ProductDashboard
        products={products}
        onProductUpdate={handleProductUpdate}
      />
    </div>
  );
}
