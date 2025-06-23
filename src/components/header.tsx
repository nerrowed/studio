import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 w-full border-b border-secondary">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="text-2xl font-semibold tracking-tighter text-primary">
          sendthesong
        </Link>
        <nav className="hidden items-center space-x-1 md:flex">
          <Button variant="ghost" className="text-primary-foreground/80 h-9 px-3 hover:bg-secondary/20 hover:text-primary-foreground" asChild>
            <Link href="/add">Submit</Link>
          </Button>
          <Button variant="ghost" className="text-primary-foreground/80 h-9 px-3 hover:bg-secondary/20 hover:text-primary-foreground" asChild>
            <a href="/#browse">Browse</a>
          </Button>
           <Button variant="ghost" className="text-primary-foreground/80 h-9 px-3 hover:bg-secondary/20 hover:text-primary-foreground" disabled>
            History
          </Button>
           <Button variant="ghost" className="text-primary-foreground/80 h-9 px-3 hover:bg-secondary/20 hover:text-primary-foreground" disabled>
            Support
          </Button>
        </nav>
      </div>
    </header>
  );
}
