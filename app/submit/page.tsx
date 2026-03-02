"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

export default function SubmitTool() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const submitTool = useMutation(api.tools.submitTool);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Writing",
    tags: "",
    websiteUrl: "",
    logoUrl: "",
    pricing: "Free",
  });

  const categories = ["Writing", "Image", "Video", "Coding", "Productivity", "Audio", "Design"];
  const pricingOptions = ["Free", "Freemium", "Paid"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    
    setIsSubmitting(true);
    try {
      const tagsArray = formData.tags.split(",").map((t: string) => t.trim()).filter((t: string) => t);
      
      await submitTool({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        tags: tagsArray,
        websiteUrl: formData.websiteUrl,
        logoUrl: formData.logoUrl || undefined,
        pricing: formData.pricing,
        userId: userId,
      });
      
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error submitting tool:", error);
      alert("Failed to submit tool. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) return <div className="p-20 text-center">Loading...</div>;
  
  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
        <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
        <p className="text-gray-400 mb-8">You must be signed in to submit a new tool.</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-green-500/10 border border-green-500/20 rounded-3xl p-10"
        >
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-green-400">Tool Submitted!</h1>
          <p className="text-gray-400">Your tool has been submitted and is pending admin approval. Redirecting to dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Submit a Tool</h1>
        <p className="text-gray-400">Share a great AI tool with the community. All submissions are reviewed before publishing.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-[#111] border border-white/10 rounded-3xl p-6 md:p-10">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Tool Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              placeholder="e.g. ChatGPT"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Website URL *</label>
            <input
              type="url"
              required
              value={formData.websiteUrl}
              onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description *</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
              placeholder="What does this tool do?"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none"
              >
                {categories.map((cat: string) => (
                  <option key={cat} value={cat} className="bg-[#111]">{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Pricing *</label>
              <select
                value={formData.pricing}
                onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none"
              >
                {pricingOptions.map((price: string) => (
                  <option key={price} value={price} className="bg-[#111]">{price}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              placeholder="e.g. LLM, Chatbot, Assistant"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Logo URL (optional)</label>
            <input
              type="url"
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              placeholder="https://..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
            </>
          ) : (
            "Submit Tool"
          )}
        </button>
      </form>
    </div>
  );
}
