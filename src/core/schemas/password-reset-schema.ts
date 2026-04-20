import { z } from "zod";

export const PasswordResetSchema = z
  .object({
    email: z
      .string()
      .min(1, "Informe seu e-mail")
      .email("Informe um e-mail válido"),
  })
  .strip();
