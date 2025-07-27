export interface FormRegister {
  name: string;
  email: string;
  password: string;
};

export interface FormLogin {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export interface LoginBody {
  email: string;
  password: string;
}
export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface ProductInput {
  name: string;
  description?: string;
  price: number;
}
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  createdAt: string;
}