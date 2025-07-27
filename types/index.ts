export type FormRegister = {
  name: string;
  email: string;
  password: string;
};

export type FormLogin = {
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

export interface ProductInput {
  name: string;
  description?: string;
  price: number;
}