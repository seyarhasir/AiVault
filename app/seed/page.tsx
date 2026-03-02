"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Loader2, Database, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SeedPage() {
  const seed = useMutation(api.seed.seed);
  const reseed = useMutation(api.seed.reseed);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<"seed" | "reseed" | null>(null);

  const handleSeed = async () => {
    setLoading("seed");
    try {
      const result = await seed();
      setStatus(result);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(null);
    }
  };

  const handleReseed = async () => {
    setLoading("reseed");
    try {
      const result = await reseed();
      setStatus(result);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
      <Database className="w-16 h-16 text-primary mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-4">Database Seeding</h1>
      <p className="text-muted-foreground mb-8">
        Populate the database with 40 sample AI tools. Use <strong>Seed</strong> for
        first-time setup, or <strong>Reseed</strong> to clear everything and start fresh.
      </p>

      <div className="flex gap-4 justify-center">
        <Button
          onClick={handleSeed}
          disabled={loading !== null}
          size="lg"
          className="px-8"
        >
          {loading === "seed" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Seeding...
            </>
          ) : (
            "Seed Database"
          )}
        </Button>

        <Button
          onClick={handleReseed}
          disabled={loading !== null}
          variant="outline"
          size="lg"
          className="px-8"
        >
          {loading === "reseed" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Reseeding...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" /> Reseed (Clear & Reload)
            </>
          )}
        </Button>
      </div>

      {status && (
        <Card className="mt-8">
          <CardContent className="p-4 text-sm font-medium">
            {status}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
