'use server';

/**
 * @fileOverview Provides a quote suggestion flow based on emotion.
 *
 * - suggestEmotionQuote - A function that returns a quote with a specific emotion.
 * - SuggestEmotionQuoteInput - The input type for the suggestEmotionQuote function.
 * - SuggestEmotionQuoteOutput - The return type for the suggestEmotionQuote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestEmotionQuoteInputSchema = z.object({
  emotion: z
    .enum(['happy', 'sad', 'neutral'])
    .describe('The emotion of the quote to be suggested.'),
});
export type SuggestEmotionQuoteInput = z.infer<typeof SuggestEmotionQuoteInputSchema>;

const SuggestEmotionQuoteOutputSchema = z.object({
  quote: z.string().describe('The quote suggested by the AI.'),
  author: z.string().optional().describe('The author of the quote, if known.'),
});
export type SuggestEmotionQuoteOutput = z.infer<typeof SuggestEmotionQuoteOutputSchema>;

export async function suggestEmotionQuote(input: SuggestEmotionQuoteInput): Promise<SuggestEmotionQuoteOutput> {
  return suggestEmotionQuoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestEmotionQuotePrompt',
  input: {schema: SuggestEmotionQuoteInputSchema},
  output: {schema: SuggestEmotionQuoteOutputSchema},
  prompt: `You are a quote suggestion AI. You will provide a quote based on the emotion requested by the user.

  The emotion requested is: {{{emotion}}}

  The quote should be appropriate for the emotion requested.  If no suitable quote can be found, return a neutral quote instead.
  The author should also be returned if known.
  `,
});

const suggestEmotionQuoteFlow = ai.defineFlow(
  {
    name: 'suggestEmotionQuoteFlow',
    inputSchema: SuggestEmotionQuoteInputSchema,
    outputSchema: SuggestEmotionQuoteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
