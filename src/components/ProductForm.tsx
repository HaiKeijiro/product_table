// src/components/ProductForm.tsx
import React, { useState, useEffect } from "react";
import { Product, ProductFormProps } from "../types";
import { createPortal } from "react-dom";

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<Product>(
    product || { id: Date.now(), name: "", price: 0, category: "" }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.price > 0) {
      onSave(formData);
      onClose();
    } else {
      alert("Please enter valid product details.");
    }
  };

  const modalRoot = document.getElementById("root");

  return modalRoot
    ? createPortal(
        <div
          className="p-4 mx-auto mt-20 bg-white shadow-md max-w-md"
        >
          <h2 className="text-lg font-bold mb-4">
            {product ? "Edit Product" : "Add Product"}
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Product Name"
              className="w-full mb-2 p-2 border"
              required
            />
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-full mb-2 p-2 border"
              min={1}
              required
            />
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full mb-4 p-2 border"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2">
              Save
            </button>
            <button
              type="button"
              className="bg-gray-300 text-black px-4 py-2 ml-2"
              onClick={onClose}
            >
              Cancel
            </button>
          </form>
        </div>,
        modalRoot
      )
    : null;
};

export default ProductForm;
