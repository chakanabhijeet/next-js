import { z } from "zod";

export const employeeSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter the full name"),

    employeeId: z
      .string()
      .trim()
      .min(3, "Employee ID must be at least 3 characters")
      .regex(
        /^[a-zA-Z0-9._@-]+$/,
        "Use only letters, numbers and . _ @ -"
      ),

    email: z.string().trim().email("Enter a valid email address"),

    phone: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),

    departmentId: z.string().min(1, "Select a department"),

    roleId: z.string().min(1, "Select a role"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Za-z]/, "Include at least one letter")
      .regex(/\d/, "Include at least one number"),

    confirmPassword: z.string().min(1, "Confirm the password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });