"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, Filter, SlidersHorizontal, ChevronRight, X } from "lucide-react";
import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import ToolCard from "@/components/tools/ToolCard";
import ToolCardSkeleton from "@/components/tools/ToolCardSkeleton";

export default function ToolsDirectory() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ToolCardSkeleton key={i} />
          ))}
        </div>
      </div>
    }>
      <ToolsDirectoryContent />
    </Suspense>
  );
}

function ToolsDirectoryContent() {
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";

  const [category, setCategory] = useState(initialCategory);
  const [pricing, setPricing] = useState("All");
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    if (search) params.set("search", search);

    const newUrl = `/tools${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.replaceState({}, "", newUrl);
  }, [category, search]);

  const tools = useQuery(api.tools.getTools, {
    category: category === "All" ? undefined : category,
    pricing: pricing === "All" ? undefined : pricing,
    search: search || undefined,
    sort,
  });

  const categories = ["All", "Writing", "Image", "Video", "Coding", "Productivity", "Audio", "Design"];
  const pricingOptions = ["All", "Free", "Freemium", "Paid"];
  const sortOptions = [
    { value: "newest", label: "Newest Arrivals" },
    { value: "upvotes", label: "Most Popular" }
  ];

  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const FilterContent = () => (
    <div className="space-y-8">
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 block">Categories</label>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`text-left px-3 py-2.5 rounded-xl text-sm transition-all border ${category === cat
                ? "bg-primary/10 border-primary/30 text-primary font-medium shadow-[0_0_15px_rgba(var(--primary),0.1)]"
                : "text-muted-foreground border-transparent hover:bg-secondary/50 hover:text-foreground"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 block">Pricing</label>
        <div className="grid grid-cols-2 gap-2">
          {pricingOptions.map((price) => (
            <button
              key={price}
              onClick={() => setPricing(price)}
              className={`text-left px-3 py-2.5 rounded-xl text-sm transition-all border ${pricing === price
                ? "bg-primary/10 border-primary/30 text-primary font-medium shadow-[0_0_15px_rgba(var(--primary),0.1)]"
                : "text-muted-foreground border-transparent hover:bg-secondary/50 hover:text-foreground"
                }`}
            >
              {price}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <Button
          variant="outline"
          className="w-full rounded-xl py-6"
          onClick={() => { setCategory("All"); setPricing("All"); setSearch(""); }}
        >
          Reset All Filters
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 md:py-10 max-w-7xl">
      {/* Mobile Top Header & Categories */}
      <div className="md:hidden space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Browse <span className="text-primary">Tools</span></h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full gap-2 px-4 shadow-sm">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
                {(category !== "All" || pricing !== "All") && (
                  <Badge variant="default" className="w-4 h-4 p-0 flex items-center justify-center text-[10px] rounded-full ml-1">
                    {(category !== "All" ? 1 : 0) + (pricing !== "All" ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] rounded-t-[32px] border-t border-border bg-background/95 backdrop-blur-xl">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-left font-bold text-xl tracking-tight px-1">Filters</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-full pb-20 px-1">
                <FilterContent />
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>

        <div className="relative group">
          <div
            ref={categoryScrollRef}
            className="flex overflow-x-auto gap-2 no-scrollbar scroll-smooth pb-2"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all border ${category === cat
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                  : "bg-card text-muted-foreground border-border hover:border-primary/50"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="absolute right-0 top-0 h-full w-12 bg-linear-to-l from-background to-transparent pointer-events-none md:hidden" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-24 space-y-8">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Directory</h1>
            <FilterContent />
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {/* Action Bar */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search 40+ AI tools..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-6 rounded-2xl bg-card/50 border-border/50 focus:bg-card transition-all"
                />
              </div>

              <div className="flex items-center gap-3">
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="w-[180px] rounded-xl bg-card border-border/50 h-11 shrink-0">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/50">
                    {sortOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="rounded-lg">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Display */}
            <AnimatePresence>
              {(category !== "All" || pricing !== "All" || search) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-2 items-center"
                >
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest mr-2">Results for:</span>
                  {category !== "All" && (
                    <Badge variant="secondary" className="gap-1 py-1 rounded-lg">
                      Category: {category}
                      <button onClick={() => setCategory("All")}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {pricing !== "All" && (
                    <Badge variant="secondary" className="gap-1 py-1 rounded-lg">
                      Pricing: {pricing}
                      <button onClick={() => setPricing("All")}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {search && (
                    <Badge variant="secondary" className="gap-1 py-1 rounded-lg">
                      Search: &ldquo;{search}&rdquo;
                      <button onClick={() => setSearch("")}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!tools ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <ToolCardSkeleton key={i} />
              ))}
            </div>
          ) : tools.length === 0 ? (
            <Card className="text-center py-20 border-none bg-secondary/10">
              <CardContent>
                <h3 className="text-xl font-semibold mb-2 tracking-tight">No tools found</h3>
                <p className="text-muted-foreground mb-6 tracking-wider">Try adjusting your search or filters.</p>
                <Button
                  variant="outline"
                  onClick={() => { setCategory("All"); setPricing("All"); setSearch(""); }}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool: any, i: number) => (
                <motion.div
                  key={tool._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.5) }}
                >
                  <ToolCard tool={tool} />
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
