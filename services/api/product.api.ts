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

export interface ProductTechnicalDetail {
  label: string;
  value: string;
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
  technical_details?: ProductTechnicalDetail[];
  category: ProductCategoryRef;
  primary_image: ProductImageRef;
  images: ProductImage[];
  has_pending_inquiry?: boolean;
  pending_inquiry_id?: string | null;
}

export const listProducts = async (query: object = {}): Promise<Product[]> => {
  const data = await serverHttpCall({
    url: "/products",
    method: "GET",
    params: query,
  });
  return Array.isArray(data) ? data : [];
};

export const getProduct = async (id: string): Promise<Product | null> => {
  try {
    const data = await serverHttpCall({
      url: `/products/${id}`,
      method: "GET",
    });
    return data && typeof data === "object" && "id" in data
      ? ((data as unknown) as Product)
      : null;
  } catch {
    return null;
  }
};
