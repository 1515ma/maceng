export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface PasswordResetInput {
  email: string;
}

export interface PasswordUpdateInput {
  password: string;
  confirmPassword: string;
}

export function createLoginInput(overrides: Partial<LoginInput> = {}): LoginInput {
  return {
    email: "user@example.com",
    password: "Senh@123",
    ...overrides,
  };
}

export function createRegisterInput(overrides: Partial<RegisterInput> = {}): RegisterInput {
  return {
    name: "João Silva",
    email: "joao@example.com",
    password: "Senh@123",
    confirmPassword: "Senh@123",
    ...overrides,
  };
}

export function createPasswordResetInput(overrides: Partial<PasswordResetInput> = {}): PasswordResetInput {
  return {
    email: "user@example.com",
    ...overrides,
  };
}

export function createPasswordUpdateInput(overrides: Partial<PasswordUpdateInput> = {}): PasswordUpdateInput {
  return {
    password: "NovaSenha@123",
    confirmPassword: "NovaSenha@123",
    ...overrides,
  };
}

export const VALID_PASSWORD = "Senh@123";
export const SHORT_PASSWORD = "12345";
export const INVALID_EMAIL = "nao-e-email";
