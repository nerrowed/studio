
"use client";

import { useState, useEffect, useTransition, Key } from "react";
import {
  suggestEmotionQuote,
  type SuggestEmotionQuoteOutput,
} from "@/ai/flows/suggest-emotion-quote";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Loader2, RefreshCw } from "lucide-react";
import Link from 'next/link';

export default function Home() {
  const [quotes, setQuotes] = useState<SuggestEmotionQuoteOutput[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const fetchQuotes = async () => {
    try {
      const quotePromises = Array(4).fill(null).map(() => 
        suggestEmotionQuote({ emotion: "sad" })
      );
      const newQuotes = await Promise.all(quotePromises);
      setQuotes(newQuotes);
    } catch (e) {
      console.error("Failed to fetch quotes:", e);
      const errorQuote = {
        quote: "Could not fetch a quote. Please try again later.",
        author: "System",
      };
      setQuotes(Array(4).fill(errorQuote));
    }
  }

  useEffect(() => {
    const getInitialQuotes = async () => {
      setIsFetching(true);
      await fetchQuotes();
      setIsFetching(false);
    };
    getInitialQuotes();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchQuotes();
    setIsRefreshing(false);
  }

  const isLoading = isFetching || isPending || isRefreshing;

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-8 font-body text-foreground">
       <div className="w-full max-w-4xl flex justify-between items-center mb-12">
        <div className="text-left">
            <h1
            className="text-5xl md:text-7xl font-bold font-headline"
            style={{ color: "hsl(var(--primary))" }}
            >
            Unspoken
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-2 font-light">
            something i couldn't say
            </p>
        </div>
        <div className="flex gap-4">
            <Button
                onClick={handleRefresh}
                disabled={isLoading}
                variant="outline"
                size="icon"
                className="h-14 w-14 rounded-full bg-card hover:bg-accent/10 border-accent/50 text-accent disabled:opacity-50"
                aria-label="Refresh quotes"
            >
                {isRefreshing ? <Loader2 className="h-7 w-7 animate-spin" /> : <RefreshCw className="h-7 w-7" />}
            </Button>
            <Button variant="default" size="icon" className="h-14 w-14 rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90" asChild>
                <Link href="/add">
                    <Plus className="h-7 w-7"/>
                </Link>
            </Button>
        </div>
      </div>

      <div className="w-full max-w-4xl flex items-center justify-center">
        {isFetching ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {Array(4).fill(null).map((_, i) => (
                    <Card key={i} className="w-full min-h-[250px] flex items-center justify-center bg-card/50 shadow-none border-none">
                        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                    </Card>
                ))}
            </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {quotes.map((q, index) => (
                <div key={index as Key} className="w-full animate-fade-in">
                    <Card className="w-full shadow-lg rounded-xl border-primary/10 min-h-[250px] flex flex-col">
                    <CardContent className="p-8 text-center flex-grow flex flex-col justify-center items-center">
                        <blockquote className="space-y-6">
                        <p className="text-2xl font-medium text-card-foreground leading-relaxed">
                            “{q.quote}”
                        </p>
                        <cite className="text-md text-muted-foreground not-italic">
                            — {q.author || "Unknown"}
                        </cite>
                        </blockquote>
                    </CardContent>
                    </Card>
                </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
