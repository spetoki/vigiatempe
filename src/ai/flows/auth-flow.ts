'use server';
/**
 * @fileOverview Manages user authentication and data retrieval.
 * - registerUser: Handles new user registration, capturing their location.
 * - getUsers: Retrieves a list of all users for the admin dashboard.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {
  RegistrationInputSchema,
  type RegistrationInput,
  RegistrationOutputSchema,
  type RegistrationOutput,
  UserSchema,
  type User,
} from '@/lib/types';

// NOTE: In a real application, this data would be stored in a database like Firestore.
// For this prototype, we'll return a hardcoded list for the admin view.
const MOCK_USERS: User[] = [
  { id: '1', email: 'admin@example.com', latitude: 34.0522, longitude: -118.2437, role: 'admin' as const },
  { id: '2', email: 'testuser1@example.com', latitude: 40.7128, longitude: -74.0060, role: 'user' as const },
  { id: '3', email: 'testuser2@example.com', latitude: 41.8781, longitude: -87.6298, role: 'user' as const },
  { id: '4', email: 'testuser3@example.com', latitude: -23.5505, longitude: -46.6333, role: 'user' as const },
];

// Flow for user registration
const registerUserFlow = ai.defineFlow(
  {
    name: 'registerUserFlow',
    inputSchema: RegistrationInputSchema,
    outputSchema: RegistrationOutputSchema,
  },
  async (input) => {
    console.log('New user registration received:', input);
    // In a real app, you would save the user to a database here.
    // We can add the user to the mock list to simulate registration for this session.
    // Note: This is an in-memory change and will reset on server restart.
    const newUser: User = {
        id: (MOCK_USERS.length + 1).toString(),
        email: input.email,
        latitude: input.latitude,
        longitude: input.longitude,
        role: 'user'
    };
    MOCK_USERS.push(newUser);

    return {
      success: true,
      message: 'Registration data received.',
    };
  }
);
export async function registerUser(input: RegistrationInput): Promise<RegistrationOutput> {
  return registerUserFlow(input);
}


// Flow to get all users (for admin)
const getUsersFlow = ai.defineFlow(
  {
    name: 'getUsersFlow',
    inputSchema: z.void(),
    outputSchema: z.array(UserSchema),
  },
  async () => {
    // In a real app, you would fetch users from the database.
    return MOCK_USERS;
  }
);
export async function getUsers(): Promise<User[]> {
  return getUsersFlow();
}
