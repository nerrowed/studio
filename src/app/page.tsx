
"use client";

import { useState, useEffect, useTransition, Key } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Link from 'next/link';

interface UserQuote {
  id: string;
  quote: string;
  author: string;
}

const QUOTES_PER_PAGE = 4;

export default function Home() {
  const [allQuotes, setAllQuotes] = useState<UserQuote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<UserQuote[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // This effect runs on the client after hydration
    try {
      const storedQuotes = localStorage.getItem('userQuotes');
      if (storedQuotes) {
        setAllQuotes(JSON.parse(storedQuotes));
      }
    } catch (error) {
      console.error("Failed to parse quotes from localStorage", error);
      setAllQuotes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    startTransition(() => {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filtered = allQuotes.filter(q =>
        q.quote.toLowerCase().includes(lowercasedFilter) ||
        q.author.toLowerCase().includes(lowercasedFilter)
      );
      setFilteredQuotes(filtered);
      setCurrentPage(0); // Reset to first page on new search
    });
  }, [searchTerm, allQuotes]);

  const pageCount = Math.ceil(filteredQuotes.length / QUOTES_PER_PAGE);
  const startIndex = currentPage * QUOTES_PER_PAGE;
  const currentQuotes = filteredQuotes.slice(startIndex, startIndex + QUOTES_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < pageCount - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const loadingOrPending = isLoading || isPending;

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-8 font-body text-foreground">
       <div className="w-full max-w-4xl flex justify-between items-center mb-8">
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
        <Button variant="default" size="icon" className="h-14 w-14 rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90" asChild>
            <Link href="/add">
                <Plus className="h-7 w-7"/>
            </Link>
        </Button>
      </div>

      <div className="w-full max-w-4xl mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search quotes or authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 h-12 text-lg rounded-full"
          />
        </div>
      </div>

      <div className="w-full max-w-4xl flex-grow">
        {loadingOrPending ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {Array(4).fill(null).map((_, i) => (
                    <Card key={i} className="w-full min-h-[250px] flex items-center justify-center bg-card/50 shadow-none border-none">
                        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                    </Card>
                ))}
            </div>
        ) : currentQuotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {currentQuotes.map((q) => (
                <div key={q.id} className="w-full animate-fade-in">
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
        ) : (
            <div className="text-center text-muted-foreground mt-16 w-full">
                <p className="text-xl">No quotes found.</p>
                {allQuotes.length === 0 ? (
                    <p>Why not <Link href="/add" className="text-primary underline">add one</Link>?</p>
                ) : (
                    <p>Try a different search term.</p>
                )}
            </div>
        )}
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
            <Button onClick={handlePrevPage} disabled={currentPage === 0 || loadingOrPending} variant="outline" size="lg">
                <ChevronLeft className="mr-2 h-5 w-5" /> Previous
            </Button>
            <span className="text-muted-foreground font-medium">
                Page {currentPage + 1} of {pageCount}
            </span>
            <Button onClick={handleNextPage} disabled={currentPage >= pageCount - 1 || loadingOrPending} variant="outline" size="lg">
                Next <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
        </div>
      )}
    </main>
  );
}
