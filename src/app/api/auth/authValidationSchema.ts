import { UserSchema } from "../../../../prisma/generated/zod";
import { z } from "zod";

export const LoginSchema = UserSchema.pick({
  email: true,
  password: true,
});

export type LoginUser = z.infer<typeof LoginSchema>

export const RegisterSchema = UserSchema.pick({
  given_name: true,
  family_name: true,
  email: true,
  password: true,
});

export const SignupSchema = RegisterSchema.extend({
  confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
}).refine((data) => data.password === data.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match' });

export type SignupUser = z.infer<typeof SignupSchema>

export const ForgotPasswordSchema = LoginSchema.pick({
  email: true,
});

export type ForgotPasswordUser = z.infer<typeof ForgotPasswordSchema>

export const ResetPasswordIntermediateSchema = LoginSchema.pick({
  password: true,
});

export const ResetPasswordSchema = ResetPasswordIntermediateSchema.extend({
  confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),  
}).refine((data) => data.password === data.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match' });

export type ResetPasswordUser = z.infer<typeof ResetPasswordSchema>

export const ProfileUpdateSchema = UserSchema.pick({
  given_name: true,
  family_name: true,
  email: true,
});

export type ProfileUpdateUser = z.infer<typeof ProfileUpdateSchema>

export const SignupValidationSchema = UserSchema.pick({
  email: true,
});

export type SignupValidationType = z.infer<typeof SignupValidationSchema>