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
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-4 py-2">
                <input
                  type="checkbox"
                  onChange={(e) => products.forEach((p) => onSelect(p.id))}
                />
              </th>
              <th className="border px-4 py-2" onClick={() => onSort("name")}>
                Name {getSortIcon("name")}
              </th>
              <th className="border px-4 py-2" onClick={() => onSort("price")}>
                Price {getSortIcon("price")}
              </th>
              <th
                className="border px-4 py-2"
                onClick={() => onSort("category")}
              >
                Category {getSortIcon("category")}
              </th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="border px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => onSelect(product.id)}
                  />
                </td>
                <td className="border px-4 py-2">{product.name}</td>
                <td className="border px-4 py-2">{product.price}</td>
                <td className="border px-4 py-2">{product.category}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="bg-yellow-500 text-white px-2 py-1 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="bg-red-500 text-white px-2 py-1"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center">No products available.</p>
      )}
    </div>
  );
};

export default ProductTable;
