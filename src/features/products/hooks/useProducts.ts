import { useState, useEffect } from "react";
import type { Products } from "../types/Products";
import { productServices } from "../services/productServices";
import toast from "react-hot-toast"; // Import toast

export default function useProducts() {
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await productServices.getAll();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const totalProduct = products.length;

  const addProduct = async (product: Omit<Products, "id" | "created_at">) => {
    try {
      const newProduct = await productServices.create(product);
      if (!newProduct) throw new Error("Insert failed");
      
      await fetchProducts();
      // toast.success("New product added to inventory!"); // Added alert
    } catch (error) {
      toast.error("Failed to add product");
      throw error;
    }
  };

  const updateProduct = async (updatedProduct: Products) => {
    const loadingToast = toast.loading("Updating product...");
    try {
      const updated = await productServices.update(updatedProduct.id, updatedProduct);
      if (updated) {
        await fetchProducts();
        toast.dismiss(loadingToast);
        toast.success("Product updated successfully!"); // Added alert
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to update product");
    }
  };

  const deleteProduct = async (id: string) => {


    const loadingToast = toast.loading("Deleting product...");
    try {
      const success = await productServices.delete(id);
      if (success) {
        await fetchProducts();
        toast.dismiss(loadingToast);
        toast.success("Product removed from inventory"); // Added alert
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Could not delete product");
    }
  };

  return {
    loading,
    products,
    totalProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    fetchProducts,
  };
}