import z from "zod";

export const userCreateInput = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().min(2, { message: "Email must be at least 2 characters" }),
  password: z
    .string()
    .min(2, { message: "Password must be at least 2 characters" }),
});

export type IUserCreate = z.infer<typeof userCreateInput>;
