import { z } from "zod";

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(1, "Informe seu nome")
      .max(200, "Nome deve ter no máximo 200 caracteres"),
    email: z
      .string()
      .min(1, "Informe seu e-mail")
      .email("Informe um e-mail válido"),
    password: z
      .string()
      .min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z
      .string()
      .min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })
  .transform(({ confirmPassword: _, ...rest }) => rest);
