"use client";

import { useState, useEffect, useTransition, Key } from "react";
import {
  suggestEmotionQuote,
  type SuggestEmotionQuoteOutput,
} from "@/ai/flows/suggest-emotion-quote";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

const emotions: ("neutral" | "happy" | "sad")[] = [
  "neutral",
  "happy",
  "sad",
];

export default function Home() {
  const [quotes, setQuotes] = useState<SuggestEmotionQuoteOutput[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [emotionIndex, setEmotionIndex] = useState(0);
  const [isFetching, setIsFetching] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const getInitialQuote = async () => {
      setIsFetching(true);
      try {
        const initialQuote = await suggestEmotionQuote({ emotion: "neutral" });
        setQuotes([initialQuote]);
        setEmotionIndex(1);
      } catch (e) {
        console.error("Failed to fetch initial quote:", e);
        setQuotes([
          {
            quote: "Could not fetch a quote. Please try again later.",
            author: "System",
          },
        ]);
      } finally {
        setIsFetching(false);
      }
    };
    getInitialQuote();
  }, []);

  const handleNext = async () => {
    if (currentIndex < quotes.length - 1) {
      startTransition(() => {
        setCurrentIndex(currentIndex + 1);
      });
    } else {
      setIsFetching(true);
      try {
        const nextEmotion = emotions[emotionIndex % emotions.length];
        const newQuote = await suggestEmotionQuote({ emotion: nextEmotion });
        setQuotes((prev) => [...prev, newQuote]);
        setEmotionIndex((prev) => prev + 1);
        startTransition(() => {
          setCurrentIndex(quotes.length);
        });
      } catch (error) {
        console.error("Failed to fetch next quote:", error);
      } finally {
        setIsFetching(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      startTransition(() => {
        setCurrentIndex(currentIndex - 1);
      });
    }
  };

  const currentQuote = quotes[currentIndex];
  const isLoading = isFetching || isPending;

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-8 font-body text-foreground">
      <div className="text-center mb-12">
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

      <div className="relative w-full max-w-2xl min-h-[250px] flex items-center justify-center">
        {isFetching && quotes.length === 0 ? (
          <Card className="w-full min-h-[250px] flex items-center justify-center bg-card/50 shadow-none border-none">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          </Card>
        ) : currentQuote ? (
          <div key={currentIndex as Key} className="w-full animate-fade-in">
            <Card className="w-full shadow-lg rounded-xl border-primary/10">
              <CardContent className="p-8 text-center min-h-[250px] flex flex-col justify-center items-center">
                <blockquote className="space-y-6">
                  <p className="text-2xl md:text-3xl font-medium text-card-foreground leading-relaxed">
                    “{currentQuote.quote}”
                  </p>
                  <cite className="text-md text-muted-foreground not-italic">
                    — {currentQuote.author || "Unknown"}
                  </cite>
                </blockquote>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-6 mt-12">
        <Button
          onClick={handlePrevious}
          disabled={currentIndex === 0 || isLoading}
          variant="outline"
          size="icon"
          className="h-14 w-14 rounded-full bg-card hover:bg-accent/10 border-accent/50 text-accent disabled:opacity-50"
          aria-label="Previous quote"
        >
          <ChevronLeft className="h-7 w-7" />
        </Button>
        <Button
          onClick={handleNext}
          disabled={isLoading && currentIndex === quotes.length}
          variant="default"
          size="icon"
          className="h-16 w-16 rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90 transition-transform hover:scale-105 disabled:opacity-50"
          aria-label="Next quote"
        >
          {isFetching && currentIndex === quotes.length - 1 ? (
            <Loader2 className="h-7 w-7 animate-spin" />
          ) : (
            <ChevronRight className="h-7 w-7" />
          )}
        </Button>
      </div>
    </main>
  );
}
