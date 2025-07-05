import { z } from 'zod';

// Schemas for registration and user data
export const RegistrationInputSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  latitude: z.number(),
  longitude: z.number(),
});
export type RegistrationInput = z.infer<typeof RegistrationInputSchema>;

export const RegistrationOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type RegistrationOutput = z.infer<typeof RegistrationOutputSchema>;

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  latitude: z.number(),
  longitude: z.number(),
  role: z.enum(['admin', 'user']),
});
export type User = z.infer<typeof UserSchema>;
