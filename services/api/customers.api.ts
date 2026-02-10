import httpCall from "../httpCall";

import type {
  RegisterCustomerRequest,
  RegisterCustomerResponse,
  VerifyCustomerEmailRequest,
  VerifyCustomerEmailResponse,
  LoginCustomerRequest,
  LoginCustomerResponse,
} from "@/types/customer.type";

export async function registerCustomer(
  data: RegisterCustomerRequest
): Promise<RegisterCustomerResponse> {
  const response = (await httpCall({
    method: "POST",
    url: "/customers/register",
    data,
  })) as RegisterCustomerResponse;

  return response;
}

export async function verifyCustomerEmail(
  data: VerifyCustomerEmailRequest
): Promise<VerifyCustomerEmailResponse> {
  const response = (await httpCall({
    method: "POST",
    url: "/customers/verify-email",
    data,
  })) as VerifyCustomerEmailResponse;

  return response;
}

export async function loginCustomer(
  data: LoginCustomerRequest
): Promise<LoginCustomerResponse> {
  const response = (await httpCall({
    method: "POST",
    url: "/customers/login",
    data,
  })) as LoginCustomerResponse;

  return response;
}

