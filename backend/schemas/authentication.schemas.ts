import { z } from "zod";

export const SignupDTO = z.object({
  email: z
    .email("Email must be a valid email address")
    .max(100, "Email must be at most 100 characters"),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters")
    .max(24, "Password must be at most 24 characters"),
});

export const LoginDTO = SignupDTO;

export type SignupDTOType = z.infer<typeof SignupDTO>;
export type LoginDTOType = z.infer<typeof LoginDTO>;
