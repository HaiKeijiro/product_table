// src/components/ProductTable.tsx
import React from "react";
import { Product } from "../types";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onSelect: (id: number) => void;
  selectedProducts: number[];
  onSort: (key: keyof Product) => void;
  sortConfig: { key: keyof Product; direction: string } | null;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEdit,
  onDelete,
  onSelect,
  selectedProducts,
  onSort,
  sortConfig,
}) => {
  const getSortIcon = (key: keyof Product) => {
    if (!sortConfig || sortConfig.key !== key) return "↕️";
    return sortConfig.direction === "ascending" ? "⬆️" : "⬇️";
  };

  return (
    <div className="overflow-x-auto">
      {products.length > 0 ? (
        <div>
          <div className="hidden md:inline">
            <table className="min-w-full">
              <thead>
                <tr className="text-left">
                  <th className="text-center">
                    <input
                      type="checkbox"
                      onChange={(e) => products.forEach((p) => onSelect(p.id))}
                    />
                  </th>
                  <th
                    className="border-b px-4 py-2 font-medium"
                    onClick={() => onSort("name")}
                  >
                    Name {getSortIcon("name")}
                  </th>
                  <th
                    className="border-b px-4 py-2 font-medium"
                    onClick={() => onSort("price")}
                  >
                    Price {getSortIcon("price")}
                  </th>
                  <th
                    className="border-b px-4 py-2 font-medium"
                    onClick={() => onSort("category")}
                  >
                    Category {getSortIcon("category")}
                  </th>
                  <th className="border-b px-4 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => onSelect(product.id)}
                      />
                    </th>
                    <td className="border-b px-4 py-2">{product.name}</td>
                    <td className="border-b px-4 py-2">{product.price}</td>
                    <td className="border-b px-4 py-2">{product.category}</td>
                    <td className="border-b px-4 py-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-sm mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden">
            <table className="min-w-full">
              <thead>
                <tr className="text-left">
                  <th className="text-center">
                    <input
                      type="checkbox"
                      onChange={(e) => products.forEach((p) => onSelect(p.id))}
                    />
                  </th>
                  <th>Product</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => onSelect(product.id)}
                      />
                    </th>
                    <td>
                      <div>{product.name}</div>
                      <div>{product.price}</div>
                      <div>{product.category}</div>
                    </td>
                    <td>
                      <button
                        onClick={() => onEdit(product)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-sm mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-center">No products available.</p>
      )}
    </div>
  );
};

export default ProductTable;
