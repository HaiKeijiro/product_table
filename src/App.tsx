import React, { useState, useEffect } from "react";
import ProductTable from "./components/ProductTable";
import ProductForm from "./components/ProductForm";
import { Product } from "./types";

// Icons
import { Plus, Trash } from "./assets/Icons";

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(5);

  // Sorting State
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product;
    direction: string;
  } | null>(null);

  // Selected Products for Bulk Delete
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  // Search Query State
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) setProducts(JSON.parse(storedProducts));
  }, []);

  const saveProduct = (product: Product) => {
    const updatedProducts = editingProduct
      ? products.map((p) => (p.id === product.id ? product : p))
      : [...products, product];
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  const deleteProduct = (id: number) => {
    const deleteItem = confirm("Are you sure you want to delete?");
    if (deleteItem) {
      const updatedProducts = products.filter((p) => p.id !== id);
      setProducts(updatedProducts);
      localStorage.setItem("products", JSON.stringify(updatedProducts));
    } else {
      alert("Canceled");
    }
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

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  // Apply Search Filter
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.price.toString().includes(searchQuery)
  );

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProductsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when page size changes
  };

  return (
    <div className="p-6 w-[90%] md:w-4/5 m-auto">
      <div className="flex justify-between mb-4 outline-none">
        <div className="flex items-center gap-4">
          <h1 className="text-xl">Product Table</h1>
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
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-2 py-1 flex-grow"
          />
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsFormOpen(true);
            }}
            className="border text-white px-3 md:py-1"
          >
            <Plus />
          </button>
          {selectedProducts.length > 0 && (
            <button
              onClick={bulkDelete}
              className="border text-white px-3 py-1"
            >
              <Trash />
            </button>
          )}
        </div>
      </div>

      <div></div>

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
          { length: Math.ceil(filteredProducts.length / productsPerPage) },
          (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`px-3 py-1 border rounded-sm ${
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
