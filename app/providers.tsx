"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { useAuth } from "@clerk/nextjs";

const convexUrl = (process.env.NEXT_PUBLIC_CONVEX_URL || "").replace(".convex.site", ".convex.cloud");
const convex = new ConvexReactClient(convexUrl);

export default function Providers({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !convexUrl || !process.env.CONVEX_DEPLOY_KEY) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Setup Required</h1>
        <p className="text-gray-400 max-w-md mb-8">
          This application requires Clerk and Convex to be configured. Please set the following environment variables in your AI Studio Secrets panel:
        </p>
        <ul className="text-left bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-2 font-mono text-sm">
          <li>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</li>
          <li>CLERK_SECRET_KEY</li>
          <li>NEXT_PUBLIC_CONVEX_URL</li>
          <li>CONVEX_DEPLOYMENT</li>
          <li>CONVEX_DEPLOY_KEY</li>
        </ul>
        <p className="mt-8 text-sm text-gray-500">
          After setting these variables, restart the application.
        </p>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
