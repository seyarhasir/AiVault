"use client";

import { HeroSection } from "@/components/home/Hero";
import FeaturedTools from "@/components/home/FeaturedTools";
import StatsSection from "@/components/home/StatsSection";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import HowItWorks from "@/components/home/HowItWorks";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <div className="flex w-full flex-col">
      <main className="grow">
        <HeroSection />
      </main>
      <FeaturedTools />
      <StatsSection />
      <CategoryShowcase />
      <HowItWorks />
      <CTASection />
    </div>
  );
}
