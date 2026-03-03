"use client";

import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton, useAuth } from "@clerk/nextjs";
import { Plus, ShieldCheck, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { isAdmin } from "@/lib/admin";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

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

function AdminMobileLink() {
  const { userId } = useAuth();
  if (!userId || !isAdmin(userId)) return null;
  return (
    <Link href="/admin" className="text-lg font-medium hover:text-primary transition-colors flex items-center gap-2">
      <ShieldCheck className="w-5 h-5" />
      Admin Panel
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

        <div className="flex items-center gap-3">
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

          {/* Mobile Menu */}
          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[350px] p-0 border-l border-border bg-background/95 backdrop-blur-xl">
                <SheetHeader className="p-6 border-b border-border">
                  <SheetTitle className="text-left font-bold text-xl tracking-tight">
                    <span className="text-primary">Ai</span> Vault
                  </SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-80px)] p-6">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Navigation</p>
                      <Link href="/tools" className="text-lg font-medium hover:text-primary transition-colors">
                        Browse Tools
                      </Link>
                      <SignedIn>
                        <Link href="/dashboard" className="text-lg font-medium hover:text-primary transition-colors">
                          Dashboard
                        </Link>
                        <Link href="/submit" className="text-lg font-medium hover:text-primary transition-colors">
                          Submit a Tool
                        </Link>
                      </SignedIn>
                    </div>

                    <SignedIn>
                      <hr className="border-border" />
                      <div className="flex flex-col gap-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account</p>
                        <div className="flex items-center gap-3 p-2 rounded-xl bg-secondary/20">
                          <UserButton afterSignOutUrl="/" showName />
                        </div>
                        <AdminMobileLink />
                      </div>
                    </SignedIn>

                    <SignedOut>
                      <hr className="border-border" />
                      <div className="mt-4">
                        <SignInButton mode="modal">
                          <Button className="w-full justify-center py-6 text-lg rounded-xl">
                            Sign In
                          </Button>
                        </SignInButton>
                      </div>
                    </SignedOut>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
