import serverHttpCall from "../serverHttpCall";

export interface ProductImageRef {
  id: string;
  key: string;
  url: string;
}

export interface ProductImage {
  image: ProductImageRef;
  image_id: string;
  is_primary: boolean;
}

export interface ProductCategoryRef {
  id: string;
  name: string;
  description: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string;
  tags: string[];
  metadata: Record<string, unknown>;
  sale_price_in_paisa: number;
  sale_price_in_rupee: number;
  created_at: string;
  updated_at: string;
  points: string[];
  category: ProductCategoryRef;
  primary_image: ProductImageRef;
  images: ProductImage[];
}

export const listProducts = async (): Promise<Product[]> => {
  const data = await serverHttpCall.get<Product[]>("/products");
  return Array.isArray(data) ? data : [];
};
