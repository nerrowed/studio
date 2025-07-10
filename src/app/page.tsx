
"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PenLine, Search, ChevronLeft, ChevronRight, BookOpen, MessagesSquare, Quote, Loader2 } from "lucide-react";
import Link from 'next/link';
import type { UserQuote } from "./actions";
import { getQuotesAction } from "./actions";


const QUOTES_PER_PAGE = 4;

const InfoCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <Card className="border-2 border-border bg-card shadow-lg hover:bg-secondary transition-colors">
        <CardHeader>
            <CardTitle className="flex items-center gap-3 font-handwriting text-2xl text-foreground">
                {icon} {title}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">
                {children}
            </p>
        </CardContent>
    </Card>
);

export default function Home() {
  const [allQuotes, setAllQuotes] = useState<UserQuote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<UserQuote[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchQuotes = async () => {
      setIsLoading(true);
      try {
        const quotesFromDb = await getQuotesAction();
        setAllQuotes(quotesFromDb);
      } catch (error) {
        console.error("Failed to fetch quotes from database", error);
        setAllQuotes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  useEffect(() => {
    startTransition(() => {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filtered = allQuotes.filter(q =>
        q.quote.toLowerCase().includes(lowercasedFilter) ||
        q.author.toLowerCase().includes(lowercasedFilter)
      );
      setFilteredQuotes(filtered);
      setCurrentPage(0);
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
    <div className="container max-w-5xl flex flex-col bg-background text-foreground py-12 md:py-24">
      <section className="w-full">
        <div className="px-4 md:px-6 text-center">
          <h1 className="font-handwriting text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
            i cant say it to you, so i create this website
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
            A collection of unspoken words and feelings.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <Link href="/add">
                Tell Your Story
                <PenLine className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
                <a href="#browse">
                    Browse the Stories
                    <Search className="ml-2 h-4 w-4" />
                </a>
            </Button>
          </div>
        </div>
      </section>
      
      <section className="w-full py-12 md:py-24">
        <div className="px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            <InfoCard icon={<MessagesSquare className="h-6 w-6 text-primary"/>} title="Share Your Message">
                Write a heartfelt message to someone special or save it as a little gift for yourself.
            </InfoCard>
            <InfoCard icon={<BookOpen className="h-6 w-6 text-primary"/>} title="Browse Messages">
                Find messages that were written for you. Search your name and uncover heartfelt messages written just for you.
            </InfoCard>
            <InfoCard icon={<Quote className="h-6 w-6 text-primary"/>} title="Read the Stories">
                Every message holds a story. Explore the collection of unspoken words shared by others.
            </InfoCard>
          </div>
        </div>
      </section>

      <section id="browse" className="w-full pb-12 md:pb-24">
        <div className="px-4 md:px-6">
            <div className="relative mb-8 max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search messages by content or recipient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 h-12 text-base rounded-lg border-2 border-border bg-background focus:ring-primary focus:border-primary"
              />
            </div>
            
          {loadingOrPending ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {Array(QUOTES_PER_PAGE).fill(null).map((_, i) => (
                    <Card key={i} className="min-h-[220px] flex items-center justify-center bg-secondary">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </Card>
                ))}
            </div>
          ) : currentQuotes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {currentQuotes.map((q) => (
                  <Card key={q.id} className="shadow-md hover:shadow-xl transition-shadow border-2 border-border bg-card flex flex-col p-6">
                    <div className="flex-grow">
                        <p className="text-sm text-muted-foreground mb-2">To: {q.author}</p>
                        <p className="font-handwriting text-2xl/tight text-foreground">
                            {q.quote}
                        </p>
                    </div>
                  </Card>
                ))}
              </div>
              {pageCount > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                    <Button onClick={handlePrevPage} disabled={currentPage === 0} variant="outline" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-semibold text-muted-foreground">
                        Page {currentPage + 1} of {pageCount}
                    </span>
                    <Button onClick={handleNextPage} disabled={currentPage >= pageCount - 1} variant="outline" size="icon">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">No messages found. Be the first to add one!</p>
               <Button asChild className="mt-4" variant="link">
                <Link href="/add">Want to add one?</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
