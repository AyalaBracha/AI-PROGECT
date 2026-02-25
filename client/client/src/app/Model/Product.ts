export interface Product {
  id: number;
  categoryId: number;
  name: string;
  image: string;  // URL לתמונה או אמוג'י
}

export interface SelectedProduct {
  product: Product;
  quantity: number;
}

export interface ProductDTO {
  name: string;
  image: string;
  categoryId: number;
}