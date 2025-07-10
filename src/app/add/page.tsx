
"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import { addQuoteAction } from '../actions';

// PENTING: Ganti kunci tes ini dengan Site Key Cloudflare Turnstile ANDA SENDIRI untuk mode produksi.
// Kunci tes ini akan menampilkan widget CAPTCHA dengan pesan "testing only".
const TURNSTILE_SITE_KEY = "1x00000000000000000000AA";

export default function AddQuotePage() {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [widgetKey, setWidgetKey] = useState(0);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote.trim()) {
      setError('Message cannot be empty.');
      return;
    }
     if (!token) {
      setError('Please complete the CAPTCHA verification.');
      return;
    }
    setError(null);
    setIsSaving(true);

    try {
      const result = await addQuoteAction({ quote, author: author || 'Anonymous', token });
      if (result.success) {
        startTransition(() => {
          router.push('/');
        });
      } else {
        setError(result.error || 'Failed to save message. Please try again.');
        // Reset Turnstile to get a new token
        setToken(null);
        setWidgetKey(k => k + 1);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`An unexpected error occurred: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = isSaving || isPending;

  return (
    <div className="container max-w-2xl py-12 md:py-24 my-auto">
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

              <Turnstile
                key={widgetKey}
                siteKey={TURNSTILE_SITE_KEY}
                onSuccess={setToken}
                options={{ theme: 'light' }}
              />

              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading || !token}>
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  'Submit Message'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
  );
}
