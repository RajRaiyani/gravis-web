export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone_number: string;
  is_email_verified: boolean;
  created_at: string;
}

export interface RegisterCustomerRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
}

export interface RegisterCustomerResponse {
  token: string;
  expires_at: string;
}

export interface VerifyCustomerEmailRequest {
  token: string;
  otp: string;
}

export interface VerifyCustomerEmailResponse {
  token: string;
  customer: Customer;
  expires_at: string;
}

export interface LoginCustomerRequest {
  email: string;
  password: string;
}

export interface LoginCustomerResponse {
  customer: Customer;
  token: string;
  expires_at: string;
}

