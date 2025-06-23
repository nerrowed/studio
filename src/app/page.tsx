
"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PenLine, Search, ChevronLeft, ChevronRight, BookOpen, MessagesSquare, Music, Loader2 } from "lucide-react";
import Link from 'next/link';

interface UserQuote {
  id: string;
  quote: string;
  author: string;
}

const QUOTES_PER_PAGE = 4;

const InfoCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <Card className="border-2 border-secondary bg-secondary/20 shadow-lg hover:bg-secondary/30 transition-colors">
        <CardHeader>
            <CardTitle className="flex items-center gap-3 font-handwriting text-2xl text-primary-foreground/90">
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
    try {
      const storedQuotes = localStorage.getItem('userQuotes');
      const initialQuotes: UserQuote[] = storedQuotes ? JSON.parse(storedQuotes) : [];

      if (initialQuotes.length === 0) {
        const dummyQuotes = [
            { id: '1', quote: 'masih ada notes kita di gallery, full of plans yang ga pernah kejadian', author: 'Reza' },
            { id: '2', quote: 'thank you for being my safe place through 2023... even if we drifted', author: 'Nayla' },
            { id: '3', quote: 'Kadang i wish i could get your random text to make my day better', author: 'Jensen' },
            { id: '4', quote: 'and the thing about goodbyes is that they can happen in a single moment, yet feel like they last a lifetime.', author: 'Novan' },
            { id: '5', quote: 'I wonder if you miss listening to my random stories as much as I miss telling them to you.', author: 'Emil' },
            { id: '6', quote: 'We were a story that was never meant to be finished.', author: 'Vanya' },
        ];
        localStorage.setItem('userQuotes', JSON.stringify(dummyQuotes));
        setAllQuotes(dummyQuotes);
      } else {
        setAllQuotes(initialQuotes);
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
    <div className="flex flex-col bg-background text-foreground">
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="font-handwriting text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
            a bunch of the untold words,
            <br />
            sent through the song
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
            Express your untold message through the song.
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
      
      <section className="w-full pb-12 md:pb-24 bg-background">
        <div className="container px-4 md:px-6 py-12">
          <div className="grid gap-6 md:grid-cols-3">
            <InfoCard icon={<MessagesSquare className="h-6 w-6 text-primary"/>} title="Share Your Message">
                Choose a song and write a heartfelt message to someone special or save it as a little gift for yourself.
            </InfoCard>
            <InfoCard icon={<BookOpen className="h-6 w-6 text-primary"/>} title="Browse Messages">
                Find messages that were written for you. Search your name and uncover heartfelt messages written just for you.
            </InfoCard>
            <InfoCard icon={<Music className="h-6 w-6 text-primary"/>} title="Detail Messages">
                Tap on any message card to discover the full story behind it and listen to the song that captures the emotion of the moment!
            </InfoCard>
          </div>
        </div>
      </section>

      <section id="browse" className="w-full pb-12 md:pb-24 pt-12">
        <div className="container px-4 md:px-6">
            <div className="relative mb-8 max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search messages by content or recipient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 h-12 text-base rounded-lg border-2 border-secondary bg-secondary/20 focus:ring-primary focus:border-primary"
              />
            </div>
            
          {loadingOrPending ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {Array(QUOTES_PER_PAGE).fill(null).map((_, i) => (
                    <Card key={i} className="min-h-[220px] flex items-center justify-center bg-secondary/20">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </Card>
                ))}
            </div>
          ) : currentQuotes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {currentQuotes.map((q) => (
                  <Card key={q.id} className="shadow-md hover:shadow-xl transition-shadow border-2 border-secondary bg-secondary/20 flex flex-col p-6">
                    <div className="flex-grow">
                        <p className="text-sm text-muted-foreground mb-2">To: {q.author}</p>
                        <p className="font-handwriting text-2xl/tight text-primary-foreground/90">
                            {q.quote}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-secondary">
                        <div className="h-10 w-10 bg-muted rounded-sm flex items-center justify-center shrink-0">
                            <Music className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-grow min-w-0">
                            <p className="font-semibold text-sm truncate">when was it over?</p>
                            <p className="text-xs text-secondary-foreground truncate">Sasha Alex Sloan, Sam Hunt</p>
                        </div>
                        <svg role="img" height="20" width="20" className="shrink-0" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor"><path d="M7.718 1.933a.75.75 0 0 1 .564 0l6 3.333a.75.75 0 0 1 0 1.334l-6 3.333a.75.75 0 0 1-1.128-.667V2.6a.75.75 0 0 1 .564-.667z"></path><path d="M1.5 2.75a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5H1.5zm0 3a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5H1.5zm0 3a.75.75 0 0 0 0 1.5H1a.75.75 0 0 0 0-1.5h.5zM1 12.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1-.75-.75z"></path></svg>
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
              <p className="text-lg text-muted-foreground">No messages found for your search.</p>
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
