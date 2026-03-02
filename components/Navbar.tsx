"use client";

import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton, useAuth } from "@clerk/nextjs";
import { Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { isAdmin } from "@/lib/admin";

function AdminLink() {
  const { userId } = useAuth();
  if (!userId || !isAdmin(userId)) return null;
  return (
    <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:flex items-center gap-1">
      <ShieldCheck className="w-3.5 h-3.5" />
      Admin
    </Link>
  );
}

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-1 font-bold text-xl tracking-tight">
          <span className="text-primary">Ai</span>
          <span className="text-foreground">Vault</span>
        </Link>

        <div className="flex items-center gap-3 ml-auto">
          <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Browse
          </Link>
          <SignedIn>
            <Button variant="secondary" size="sm" asChild className="hidden sm:flex">
              <Link href="/submit">
                <Plus className="w-4 h-4 mr-1" />
                Submit
              </Link>
            </Button>
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Dashboard
            </Link>
            <AdminLink />
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="sm">Sign In</Button>
            </SignInButton>
          </SignedOut>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
