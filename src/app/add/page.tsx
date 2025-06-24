
"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { addQuoteAction } from '../actions';

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
      const result = await addQuoteAction({ quote, author: author || 'Anonymous' });
      if (result.success) {
        startTransition(() => {
          router.push('/');
        });
      } else {
        setError(result.error || 'Failed to save message. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = isSaving || isPending;

  return (
    <main className="container max-w-2xl py-12 md:py-24">
        <Card className="w-full border-2 border-border bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="font-handwriting text-4xl text-foreground">
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
                  className="min-h-[150px] text-xl font-handwriting bg-background border-border focus:ring-primary"
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
                  className="bg-background border-border focus:ring-primary"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
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
