import httpCall from "../httpCall";

export interface SubmitProductInquiryPayload {
  product_id: string;
  message: string;
  quantity?: number;
}

export interface ProductInquiryResponse {
  inquiry: unknown;
  message: string;
}

export async function submitProductInquiry(
  payload: SubmitProductInquiryPayload
): Promise<ProductInquiryResponse> {
  const response = await httpCall({
    method: "POST",
    url: "/inquiry/product",
    data: payload,
  });
  return response as unknown as ProductInquiryResponse;
}

export interface SubmitContactInquiryPayload {
  name: string;
  email: string;
  phone_number: string;
  message: string;
}

export interface ContactInquiryResponse {
  inquiry: unknown;
  message: string;
}

export async function submitContactInquiry(
  payload: SubmitContactInquiryPayload
): Promise<ContactInquiryResponse> {
  const response = await httpCall({
    method: "POST",
    url: "/inquiry/contact",
    data: payload,
  });
  return response as unknown as ContactInquiryResponse;
}
