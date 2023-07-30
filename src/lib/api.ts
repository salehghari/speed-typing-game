import { IQuoteData } from '../types/api';

const RANDOM_QUOTE_API_URL = 'https://api.quotable.io/random'; // ?minLength=50&maxLength=75


export async function getRandomQuote(minLength: string, maxLength: string): Promise<IQuoteData> {
  const response = await fetch(`${RANDOM_QUOTE_API_URL}?minLength=${minLength}&maxLength=${maxLength}`);
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json() as unknown as IQuoteData;
}