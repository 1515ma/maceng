import { z } from "zod";

export const PasswordUpdateSchema = z
  .object({
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
