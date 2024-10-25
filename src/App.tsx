// src/App.tsx
import React, { useState, useEffect } from "react";
import ProductTable from "./components/ProductTable";
import ProductForm from "./components/ProductForm";
import { Product } from "./types";

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, []);

  const saveProduct = (product: Product) => {
    const updatedProducts = editingProduct
      ? products.map((p) => (p.id === product.id ? product : p))
      : [...products, product];

    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  const deleteProduct = (id: number) => {
    const updatedProducts = products.filter((p) => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Product Management App</h1>
      <button
        onClick={() => {
          setEditingProduct(null);
          setIsFormOpen(true);
        }}
        className="bg-green-500 text-white px-4 py-2 mb-4"
      >
        Add Product
      </button>
      <ProductTable
        products={products}
        onEdit={(product) => {
          setEditingProduct(product);
          setIsFormOpen(true);
        }}
        onDelete={deleteProduct}
      />
      {isFormOpen && (
        <ProductForm
          product={editingProduct || undefined}
          onSave={saveProduct}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
