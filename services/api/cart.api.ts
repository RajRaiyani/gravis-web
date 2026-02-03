import httpCall from "../httpCall";

export const GUEST_ID_STORAGE_KEY = "guest_id";


export interface UpdateCartResponse {
  guest_id?: string;
  product_id: string;
}

export interface CartItemImage {
  id: string;
  key: string;
  url: string;
}

export interface CartItem {
  quantity: number;
  product_id: string;
  description: string;
  product_name: string;
  primary_image: CartItemImage;
  sale_price_in_paisa: number;
}

export interface CartResponse {
  items: CartItem[];
  total: number;
}

export async function getCart(): Promise<CartResponse> {
  const response = await httpCall({
    method: "GET",
    url: "/cart",
  });
  return response as unknown as CartResponse;
}



export async function updateCartItem(
  product_id: string,
  quantity: number
): Promise<UpdateCartResponse> {
  const response = (await httpCall({
    method: "PUT",
    url: `/cart/${product_id}`,
    data: { quantity },
  })) as UpdateCartResponse;

  if (
    typeof window !== "undefined" &&
    response.guest_id
  ) {
    localStorage.setItem(GUEST_ID_STORAGE_KEY, response.guest_id);
  }
  return response;
}
