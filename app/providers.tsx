"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ThemeProvider } from "next-themes";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex!} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !convexUrl || !convex) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
            <span className="text-primary text-2xl font-bold">AI</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">Setup Required</h1>
          <p className="text-muted-foreground max-w-md mb-8">
            This application requires Clerk and Convex to be configured. Please set the following environment variables:
          </p>
          <ul className="text-left bg-card p-6 rounded-xl border border-border space-y-2 font-mono text-sm">
            <li className="text-primary">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</li>
            <li className="text-primary">CLERK_SECRET_KEY</li>
            <li className="text-primary">NEXT_PUBLIC_CONVEX_URL</li>
            <li className="text-primary">CONVEX_DEPLOYMENT</li>
            <li className="text-primary">CONVEX_DEPLOY_KEY</li>
          </ul>
          <p className="mt-8 text-sm text-muted-foreground">
            After setting these variables, restart the application.
          </p>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </ClerkProvider>
    </ThemeProvider>
  );
}
