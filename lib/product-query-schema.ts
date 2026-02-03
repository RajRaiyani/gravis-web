import { z } from "zod";

export const productListQuerySchema = z.object({
  category_id: z
    .string()
    .optional()
    .transform((v) => (v === "" ? undefined : v))
    .pipe(
      z
        .string()
        .uuid({ version: "v7", message: "Invalid category ID" })
        .optional()
    ),
  search: z.string().trim().toLowerCase().optional(),
  offset: z
    .string()
    .default("0")
    .transform((val) => parseInt(val, 10))
    .pipe(
      z.number().int().min(0, "Offset must be at least 0")
    ),
  limit: z
    .string()
    .default("30")
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number()
        .int()
        .min(1, "Limit must be greater than 0")
        .max(100, "Limit must be less than 100")
    ),
});

export type ProductListQuery = z.infer<typeof productListQuerySchema>;
