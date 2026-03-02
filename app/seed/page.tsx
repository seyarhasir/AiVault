"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Loader2, Database } from "lucide-react";

export default function SeedPage() {
  const seed = useMutation(api.seed.seed);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    try {
      const result = await seed();
      setStatus(result);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
      <Database className="w-16 h-16 text-purple-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-4">Database Seeding</h1>
      <p className="text-gray-400 mb-8">
        Click the button below to populate the database with 20 real AI tools.
        This is useful for testing the application before users submit their own tools.
      </p>
      
      <button
        onClick={handleSeed}
        disabled={loading}
        className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Seeding...
          </>
        ) : (
          "Seed Database"
        )}
      </button>

      {status && (
        <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl text-sm font-medium">
          {status}
        </div>
      )}
    </div>
  );
}
