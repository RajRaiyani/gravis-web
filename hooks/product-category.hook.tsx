import { useQuery } from "@tanstack/react-query";
import { listProductCategories } from "@/services/api/product-category.api";

export const useListProductCategories = () => {
  const query = useQuery({
    queryKey: ["product-categories"],
    queryFn: listProductCategories,
  });
  return query;
};
