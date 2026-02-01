import serverHttpCall from "../serverHttpCall";

export interface ProductCategoryImage {
  id: string;
  key: string;
  url: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  image_id: string;
  image: ProductCategoryImage;
}

export const listProductCategories = async (): Promise<ProductCategory[]> => {
  const data = await serverHttpCall.get<ProductCategory[]>("/product-categories");
  return Array.isArray(data) ? data : [];
};