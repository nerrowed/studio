
"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface UserQuote {
  id: string;
  quote: string;
  author: string;
}

// This function now saves the quote to localStorage
async function saveQuote(quote: { quote: string; author: string }) {
  console.log("Saving quote to localStorage:", quote);
  try {
    const existingQuotes: UserQuote[] = JSON.parse(localStorage.getItem('userQuotes') || '[]');
    const newQuote: UserQuote = {
      id: new Date().toISOString() + Math.random(), // Simple unique ID
      quote: quote.quote,
      author: quote.author,
    };
    const updatedQuotes = [newQuote, ...existingQuotes]; // Add to the beginning
    localStorage.setItem('userQuotes', JSON.stringify(updatedQuotes));
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async operation
    return { success: true };
  } catch (error) {
    console.error("Failed to save to localStorage", error);
    return { success: false };
  }
}


export default function AddQuotePage() {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote.trim()) {
      setError('Message cannot be empty.');
      return;
    }
    setError(null);
    setIsSaving(true);

    try {
      await saveQuote({ quote, author: author || 'Anonymous' });
      startTransition(() => {
        router.push('/');
      });
    } catch (err) {
      setError('Failed to save message. Please try again.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = isSaving || isPending;

  return (
    <main className="container max-w-2xl py-12 md:py-24">
        <Card className="w-full border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="font-handwriting text-4xl">
              Tell Your Story
            </CardTitle>
            <CardDescription>
                Write your untold message. It can be for someone, or just for yourself.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="quote" className="font-semibold text-muted-foreground">Your Message</label>
                <Textarea
                  id="quote"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="The words you couldn't say..."
                  className="min-h-[150px] text-xl font-handwriting"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="author" className="font-semibold text-muted-foreground">To (Name or initial)</label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Reza, N, etc."
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" size="lg" className="w-full bg-slate-900 text-white hover:bg-slate-800" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  'Submit Message'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
  );
}
