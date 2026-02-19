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

export interface CategoryBanner {
  id: string;
  name: string;
  description: string;
  banner_image_id: string;
  banner_image: ProductCategoryImage;
}

export const listProductCategories = async (): Promise<ProductCategory[]> => {
  const data = await serverHttpCall({
    url: "/product-categories",
    method: "GET",
  });
  return Array.isArray(data) ? data : [];
};

export const listCategoryBanners = async (): Promise<CategoryBanner[]> => {
  const data = await serverHttpCall({
    url: "/product-categories/banners",
    method: "GET",
  });
  return Array.isArray(data) ? data : [];
};