import {z} from "zod";

const passwordValidation = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  );

export const userSignupSchema = z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Password should be at least 8 characters." })
      .regex(passwordValidation, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      })
      .max(64),
    name: z.string().min(3).max(50),
  });

export const userSigninSchema = z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Password should be at least 8 characters." })
      .regex(passwordValidation, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      })
      .max(64),
  });


export const createRoomSchema = z.object({
  name: z.string()
})