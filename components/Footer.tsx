import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Top section: Brand + CTA */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
          <div className="max-w-md">
            <Link href="/" className="inline-block mb-3">
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-primary">Ai</span>
                <span className="text-foreground">Vault</span>
              </span>
            </Link>
            <p className="text-muted-foreground tracking-wider">
              The ultimate directory for discovering, comparing, and sharing the best AI tools across every category.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/tools"
              className="inline-flex items-center px-5 py-2.5 rounded-md border border-border bg-secondary/50 text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
            >
              Browse All Tools
            </Link>
            <Link
              href="/submit"
              className="inline-flex items-center px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all"
            >
              Submit a Tool
            </Link>
          </div>
        </div>

        <Separator className="mb-12" />

        {/* Links grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground tracking-tight">Explore</h4>
            <ul className="space-y-3">
              {[
                { label: "All Tools", href: "/tools" },
                { label: "Featured", href: "/" },
                { label: "New Additions", href: "/tools" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors tracking-wider">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground tracking-tight">Categories</h4>
            <ul className="space-y-3">
              {["Writing", "Image", "Coding", "Video", "Audio"].map((cat) => (
                <li key={cat}>
                  <Link href={`/tools?category=${cat}`} className="text-sm text-muted-foreground hover:text-primary transition-colors tracking-wider">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground tracking-tight">More Categories</h4>
            <ul className="space-y-3">
              {["Productivity", "Design", "Research", "Marketing", "Business"].map((cat) => (
                <li key={cat}>
                  <Link href={`/tools?category=${cat}`} className="text-sm text-muted-foreground hover:text-primary transition-colors tracking-wider">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground tracking-tight">Account</h4>
            <ul className="space-y-3">
              {[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Submit a Tool", href: "/submit" },
                { label: "Sign In", href: "/sign-in" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors tracking-wider">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground tracking-tight">Pricing</h4>
            <ul className="space-y-3">
              {["Free", "Freemium", "Paid"].map((pricing) => (
                <li key={pricing}>
                  <Link href={`/tools?pricing=${pricing}`} className="text-sm text-muted-foreground hover:text-primary transition-colors tracking-wider">
                    {pricing} Tools
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground tracking-wider">
            &copy; {new Date().getFullYear()} AiVault. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/tools" className="text-xs text-muted-foreground hover:text-primary transition-colors tracking-wider">
              Privacy Policy
            </Link>
            <Link href="/tools" className="text-xs text-muted-foreground hover:text-primary transition-colors tracking-wider">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
