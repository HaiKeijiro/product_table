// src/App.tsx
import React, { useState, useEffect } from "react";
import ProductTable from "./components/ProductTable";
import ProductForm from "./components/ProductForm";
import { Product } from "./types";

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(5); // Default value

  // Sorting State
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product;
    direction: string;
  } | null>(null);

  // Selected Products for Bulk Delete
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

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

  const bulkDelete = () => {
    const updatedProducts = products.filter(
      (p) => !selectedProducts.includes(p.id)
    );
    setProducts(updatedProducts);
    setSelectedProducts([]);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  const handleSelect = (id: number) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((prodId) => prodId !== id) : [...prev, id]
    );
  };

  const sortProducts = (key: keyof Product) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }

    const sortedProducts = [...products].sort((a, b) => {
      const valueA = a[key] ?? "";
      const valueB = b[key] ?? "";

      if (valueA < valueB) return direction === "ascending" ? -1 : 1;
      if (valueA > valueB) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    setProducts(sortedProducts);
  };

  // Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProductsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when page size changes
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
      {selectedProducts.length > 0 && (
        <button
          onClick={bulkDelete}
          className="bg-red-500 text-white px-4 py-2 mb-4 ml-4"
        >
          Delete Selected
        </button>
      )}

      <div className="mb-4">
        <label htmlFor="pageSize" className="mr-2">
          Products per page:
        </label>
        <select
          id="pageSize"
          value={productsPerPage}
          onChange={handlePageSizeChange}
          className="border px-2 py-1"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      <ProductTable
        products={currentProducts}
        onEdit={(product) => {
          setEditingProduct(product);
          setIsFormOpen(true);
        }}
        onDelete={deleteProduct}
        onSelect={handleSelect}
        selectedProducts={selectedProducts}
        onSort={sortProducts}
        sortConfig={sortConfig}
      />

      <div className="mt-4">
        {Array.from(
          { length: Math.ceil(products.length / productsPerPage) },
          (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`px-3 py-1 border ${
                currentPage === i + 1 ? "bg-blue-500 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>

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
