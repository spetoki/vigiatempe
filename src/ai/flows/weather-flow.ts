'use server';
/**
 * @fileOverview A weather-checking AI agent.
 *
 * - getWeather - A function that handles getting the weather.
 * - GetWeatherInput - The input type for the getWeather function.
 * - GetWeatherOutput - The return type for the getWeather function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetWeatherInputSchema = z.object({
  latitude: z.number().describe("The latitude for the weather location."),
  longitude: z.number().describe("The longitude for the weather location."),
});
export type GetWeatherInput = z.infer<typeof GetWeatherInputSchema>;

const GetWeatherOutputSchema = z.object({
  temperature: z.number().describe('The current temperature in Celsius.'),
  condition: z.string().describe('A short description of the weather condition (e.g., Sunny, Partly Cloudy, Light Rain).'),
  location: z.string().describe('The city and country name for the given coordinates.'),
});
export type GetWeatherOutput = z.infer<typeof GetWeatherOutputSchema>;

export async function getWeather(input: GetWeatherInput): Promise<GetWeatherOutput> {
  return getWeatherFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getWeatherPrompt',
  input: {schema: GetWeatherInputSchema},
  output: {schema: GetWeatherOutputSchema},
  prompt: `You are a helpful weather assistant. Based on the provided latitude: {{{latitude}}} and longitude: {{{longitude}}}, determine the current weather.
  
  Provide the current temperature in Celsius.
  Provide a short, 1-3 word summary of the weather condition (e.g., Sunny, Partly Cloudy, Light Rain, Heavy Snow).
  Provide the location in "City, Country" format.
  
  Return the data in the specified JSON format.`,
});

const getWeatherFlow = ai.defineFlow(
  {
    name: 'getWeatherFlow',
    inputSchema: GetWeatherInputSchema,
    outputSchema: GetWeatherOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
