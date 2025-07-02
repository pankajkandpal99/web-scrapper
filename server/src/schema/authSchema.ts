import { z } from "zod";

// const phoneRegex = /^\+[1-9]\d{1,14}$/;

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username cannot be more than 20 characters")
      .optional(),
    email: z.string().email("Invalid email address").optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be exactly 10 digits")
      .max(10, "Phone number must be exactly 10 digits")
      .regex(/^[0-9]+$/, "Phone number must contain only numbers"),
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z
  .object({
    email: z.string().email("Invalid email address").optional(),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be exactly 10 digits")
      .max(10, "Phone number must be exactly 10 digits")
      .regex(/^[0-9]+$/, "Phone number must contain only numbers")
      .optional(),

    password: z.string().min(8, "Password must be at least 8 characters"),
  })
  .strict()
  .refine(
    (data) => {
      const loginMethodsProvided = [
        data.email ? 1 : 0,
        data.phoneNumber ? 1 : 0,
      ].reduce((a, b) => a + b, 0);

      return loginMethodsProvided === 1;
    },
    {
      message:
        "Exactly one login method (email or phone number) must be provided",
      path: ["phoneNumber"],
    }
  );
