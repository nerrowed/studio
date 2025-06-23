
"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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
      setError('Quote cannot be empty.');
      return;
    }
    setError(null);
    setIsSaving(true);

    try {
      await saveQuote({ quote, author: author || 'Unknown' });
      startTransition(() => {
        router.push('/');
      });
    } catch (err) {
      setError('Failed to save quote. Please try again.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = isSaving || isPending;

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-8 font-body text-foreground">
        <div className="absolute top-4 left-4">
            <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                    <ArrowLeft />
                </Link>
            </Button>
        </div>
      <div className="w-full max-w-xl">
        <Card className="shadow-lg rounded-xl border-primary/10">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold font-headline" style={{ color: "hsl(var(--primary))" }}>
              Add a New Quote
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="quote" className="text-sm font-medium text-muted-foreground">Quote</label>
                <Textarea
                  id="quote"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="The words you couldn't say..."
                  className="min-h-[120px] text-lg"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="author" className="text-sm font-medium text-muted-foreground">Author (Optional)</label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Who said it?"
                  className="text-lg"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  'Save Quote'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
