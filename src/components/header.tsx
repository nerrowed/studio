import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 w-full border-b">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="text-2xl font-semibold tracking-tighter">
          sendthesong
        </Link>
        <nav className="hidden items-center space-x-1 md:flex">
          <Button variant="link" className="text-primary-foreground h-9 px-3 hover:no-underline hover:bg-primary-foreground/10" asChild>
            <Link href="/add">Submit</Link>
          </Button>
          <Button variant="link" className="text-primary-foreground h-9 px-3 hover:no-underline hover:bg-primary-foreground/10" asChild>
            <Link href="/">Browse</Link>
          </Button>
           <Button variant="link" className="text-primary-foreground h-9 px-3 hover:no-underline hover:bg-primary-foreground/10" disabled>
            History
          </Button>
           <Button variant="link" className="text-primary-foreground h-9 px-3 hover:no-underline hover:bg-primary-foreground/10" disabled>
            Support
          </Button>
        </nav>
      </div>
    </header>
  );
}
