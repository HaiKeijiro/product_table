// src/types.ts
export type Product = {
  id: number;
  name: string;
  price: number;
  category?: string;
};

export type ProductFormProps = {
  product?: Product;
  onSave: (product: Product) => void;
  onClose: () => void;
};
