import { listProductCategories } from "@/services/api/product-category.api";
import { CategoryCarousel } from "./category-carousel";

export const Categories = async () => {
  const categories = await listProductCategories();

  if (!categories?.length) {
    return (
      <section className="px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="font-michroma text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Categories
          </h2>
          <p className="mt-3 text-muted-foreground">
            No categories yet. Check back soon.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-12 md:px-6 lg:px-8">
      <div className="mx-auto container">
        <header className="mb-2">
          <h2 className="text-2xl font-semibold md:text-3xl">
            Shop By Categories
          </h2>
        </header>

        <CategoryCarousel categories={categories} />
      </div>
    </section>
  );
};
