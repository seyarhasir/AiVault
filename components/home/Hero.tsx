"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SparklesIcon, ArrowRightIcon, Search } from "lucide-react";
import { LogoCloud } from "@/components/home/LogoCloud";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function HeroSection() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/tools?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <section className="mx-auto w-full max-w-5xl">
      {/* Top Shades */}
      <div
        aria-hidden="true"
        className="absolute inset-0 isolate hidden overflow-hidden contain-strict lg:block"
      >
        <div className="absolute inset-0 -top-14 isolate -z-10 bg-[radial-gradient(35%_80%_at_49%_0%,--theme(--color-foreground/.08),transparent)] contain-strict" />
      </div>

      {/* X Bold Faded Borders */}
      <div
        aria-hidden="true"
        className="absolute inset-0 mx-auto hidden min-h-screen w-full max-w-5xl lg:block"
      >
        <div className="mask-y-from-80% mask-y-to-100% absolute inset-y-0 left-0 z-10 h-full w-px bg-foreground/15" />
        <div className="mask-y-from-80% mask-y-to-100% absolute inset-y-0 right-0 z-10 h-full w-px bg-foreground/15" />
      </div>

      {/* main content */}
      <div className="relative flex flex-col items-center justify-center gap-5 pt-32 pb-30">
        {/* X Content Faded Borders */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-1 size-full overflow-hidden"
        >
          <div className="absolute inset-y-0 left-4 w-px bg-linear-to-b from-transparent via-border to-border md:left-8" />
          <div className="absolute inset-y-0 right-4 w-px bg-linear-to-b from-transparent via-border to-border md:right-8" />
          <div className="absolute inset-y-0 left-8 w-px bg-linear-to-b from-transparent via-border/50 to-border/50 md:left-12" />
          <div className="absolute inset-y-0 right-8 w-px bg-linear-to-b from-transparent via-border/50 to-border/50 md:right-12" />
        </div>

        <a
          className={cn(
            "group mx-auto flex w-fit items-center gap-3 rounded-full border bg-card px-3 py-1 shadow",
            "fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards transition-all delay-500 duration-500 ease-out"
          )}
          href="/tools"
        >
          <SparklesIcon className="size-3 text-primary" />
          <span className="text-xs">40+ curated AI tools</span>
          <span className="block h-5 border-l" />
          <ArrowRightIcon className="size-3 duration-150 ease-out group-hover:translate-x-1" />
        </a>

        <h1
          className={cn(
            "fade-in slide-in-from-bottom-10 animate-in text-balance fill-mode-backwards text-center text-4xl tracking-tight delay-100 duration-500 ease-out md:text-5xl lg:text-6xl",
            "text-shadow-[0_0px_50px_theme(--color-foreground/.2)]"
          )}
        >
          Discover the Best <br />
          <span className="text-primary">AI Tools</span> for Your Workflow
        </h1>

        <p className="fade-in slide-in-from-bottom-10 mx-auto max-w-md animate-in fill-mode-backwards text-center text-base text-foreground/80 tracking-wider delay-200 duration-500 ease-out sm:text-lg md:text-xl">
          A curated directory of powerful AI tools, <br /> updated daily. Find
          exactly what you need.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="fade-in slide-in-from-bottom-10 relative mx-auto w-full max-w-xl animate-in fill-mode-backwards delay-250 duration-500 ease-out"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search AI tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-6 text-lg rounded-full bg-card border-border focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </form>

        <div className="fade-in slide-in-from-bottom-10 flex animate-in flex-row flex-wrap items-center justify-center gap-3 fill-mode-backwards pt-2 delay-300 duration-500 ease-out">
          <Button className="rounded-md" size="lg" variant="secondary" asChild>
            <Link href="/submit">
              <SparklesIcon className="size-4 mr-2" />
              Submit a Tool
            </Link>
          </Button>
          <Button className="rounded-md" size="lg" asChild>
            <Link href="/tools">
              Browse Directory
              <ArrowRightIcon className="size-4 ms-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function LogosSection() {
  return (
    <section className="relative space-y-4 border-t pt-6 pb-10">
      <h2 className="text-center font-medium text-lg text-muted-foreground tracking-tight md:text-xl">
        Featuring tools from{" "}
        <span className="text-foreground">industry leaders</span>
      </h2>
      <div className="relative z-10 mx-auto max-w-4xl">
        <LogoCloud logos={logos} />
      </div>
    </section>
  );
}

const logos = [
  {
    src: "https://logos.hunter.io/openai.com",
    alt: "OpenAI",
  },
  {
    src: "https://logos.hunter.io/anthropic.com",
    alt: "Anthropic",
  },
  {
    src: "https://logos.hunter.io/google.com",
    alt: "Google",
  },
  {
    src: "https://logos.hunter.io/github.com",
    alt: "GitHub",
  },
  {
    src: "https://logos.hunter.io/adobe.com",
    alt: "Adobe",
  },
  {
    src: "https://logos.hunter.io/notion.so",
    alt: "Notion",
  },
  {
    src: "https://logos.hunter.io/canva.com",
    alt: "Canva",
  },
  {
    src: "https://logos.hunter.io/figma.com",
    alt: "Figma",
  },
];
