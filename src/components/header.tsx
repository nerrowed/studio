import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 w-full border-b border-border">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="font-handwriting text-2xl font-bold tracking-tight text-primary">
          something i couldnt say
        </Link>
        <nav className="hidden items-center space-x-1 md:flex">
          <Button variant="ghost" className="text-foreground/80 h-9 px-3 hover:bg-secondary hover:text-secondary-foreground" asChild>
            <Link href="/add">Submit</Link>
          </Button>
          <Button variant="ghost" className="text-foreground/80 h-9 px-3 hover:bg-secondary hover:text-secondary-foreground" asChild>
            <a href="/#browse">Browse</a>
          </Button>
           <Button variant="ghost" className="text-foreground/80 h-9 px-3 hover:bg-secondary hover:text-secondary-foreground" disabled>
            History
          </Button>
           <Button variant="ghost" className="text-foreground/80 h-9 px-3 hover:bg-secondary hover:text-secondary-foreground" disabled>
            Support
          </Button>
        </nav>
      </div>
    </header>
  );
}
