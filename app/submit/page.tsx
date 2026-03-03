"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SubmitBasics } from "@/components/tools/SubmitBasics";
import { SubmitDetails } from "@/components/tools/SubmitDetails";
import { SubmitLinks } from "@/components/tools/SubmitLinks";
import { SubmitSuccess } from "@/components/tools/SubmitSuccess";
import { SubmitSignIn } from "@/components/tools/SubmitSignIn";

export default function SubmitTool() {
  const { userId, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const submitTool = useMutation(api.tools.submitTool);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    longDescription: "",
    category: "Writing",
    tags: [] as string[],
    websiteUrl: "",
    logoUrl: "",
    pricing: "Free",
    pricingDetails: "",
    features: [] as string[],
    useCases: [] as string[],
    pros: [] as string[],
    cons: [] as string[],
    platforms: [] as string[],
    twitterUrl: "",
    githubUrl: "",
    discordUrl: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [useCaseInput, setUseCaseInput] = useState("");
  const [proInput, setProInput] = useState("");
  const [conInput, setConInput] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [logoInputType, setLogoInputType] = useState<"url" | "upload">("url");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addToList = (field: "tags" | "features" | "useCases" | "pros" | "cons", value: string, setter: (v: string) => void) => {
    const trimmed = value.trim();
    if (!trimmed || formData[field].includes(trimmed)) return;
    setFormData({ ...formData, [field]: [...formData[field], trimmed] });
    setter("");
  };

  const removeFromList = (field: "tags" | "features" | "useCases" | "pros" | "cons", index: number) => {
    setFormData({ ...formData, [field]: formData[field].filter((_: string, i: number) => i !== index) });
  };

  const togglePlatform = (platform: string) => {
    setFormData({
      ...formData,
      platforms: formData.platforms.includes(platform)
        ? formData.platforms.filter((p) => p !== platform)
        : [...formData.platforms, platform],
    });
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setFormData({ ...formData, logoUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearLogoFile = () => {
    setLogoFile(null);
    setLogoPreview("");
    setFormData({ ...formData, logoUrl: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setIsSubmitting(true);
    try {
      const result = await submitTool({
        name: formData.name,
        description: formData.description,
        longDescription: formData.longDescription || undefined,
        category: formData.category,
        tags: formData.tags,
        websiteUrl: formData.websiteUrl,
        logoUrl: formData.logoUrl || undefined,
        pricing: formData.pricing,
        pricingDetails: formData.pricingDetails || undefined,
        features: formData.features.length > 0 ? formData.features : undefined,
        useCases: formData.useCases.length > 0 ? formData.useCases : undefined,
        pros: formData.pros.length > 0 ? formData.pros : undefined,
        cons: formData.cons.length > 0 ? formData.cons : undefined,
        platforms: formData.platforms.length > 0 ? formData.platforms : undefined,
        twitterUrl: formData.twitterUrl || undefined,
        githubUrl: formData.githubUrl || undefined,
        discordUrl: formData.discordUrl || undefined,
      });

      // Email notifications...
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'submission',
            to: user?.primaryEmailAddress?.emailAddress,
            recipientUserId: userId,
            preferenceKey: 'submissionUpdates',
            data: { toolName: formData.name }
          }),
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }

      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'admin-notification',
            to: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@aivault.com',
            data: {
              toolName: formData.name,
              submittedBy: userId,
              adminUrl: `${window.location.origin}/admin/tools/${result.toolId}`
            }
          }),
        });
      } catch (emailError) {
        console.error('Failed to send admin notification:', emailError);
      }

      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (error) {
      console.error("Error submitting tool:", error);
      alert("Failed to submit tool. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) return <div className="p-20 text-center text-muted-foreground">Loading...</div>;
  if (!userId) return <SubmitSignIn />;
  if (success) return <SubmitSuccess />;

  const canProceedStep1 = formData.name && formData.websiteUrl && formData.description;
  const canProceedStep2 = formData.tags.length > 0;

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-balance text-3xl tracking-tight text-shadow-[0_0px_50px_theme(--color-foreground/.2)] md:text-4xl mb-2">
          Submit a <span className="text-primary">Tool</span>
        </h1>
        <p className="text-muted-foreground tracking-wider">Share a great AI tool with the community. All submissions are reviewed before publishing.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <button
              type="button"
              onClick={() => { if (s < step) setStep(s); }}
              className={`w-8 h-8 rounded-full text-sm font-medium flex items-center justify-center shrink-0 transition-colors ${s === step ? "bg-primary text-primary-foreground" :
                s < step ? "bg-primary/20 text-primary cursor-pointer" :
                  "bg-secondary text-muted-foreground"
                }`}
            >
              {s}
            </button>
            <span className={`text-sm hidden sm:block ${s === step ? "font-medium" : "text-muted-foreground"}`}>
              {s === 1 ? "Basics" : s === 2 ? "Details" : "Links & Submit"}
            </span>
            {s < 3 && <div className={`flex-1 h-px ${s < step ? "bg-primary/40" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <SubmitBasics
            formData={formData}
            setFormData={setFormData}
            logoInputType={logoInputType}
            setLogoInputType={setLogoInputType}
            logoFile={logoFile}
            logoPreview={logoPreview}
            handleLogoFileChange={handleLogoFileChange}
            clearLogoFile={clearLogoFile}
            fileInputRef={fileInputRef}
            setStep={setStep}
            canProceed={!!canProceedStep1}
          />
        )}

        {step === 2 && (
          <SubmitDetails
            formData={formData}
            setFormData={setFormData}
            tagInput={tagInput}
            setTagInput={setTagInput}
            featureInput={featureInput}
            setFeatureInput={setFeatureInput}
            useCaseInput={useCaseInput}
            setUseCaseInput={setUseCaseInput}
            proInput={proInput}
            setProInput={setProInput}
            conInput={conInput}
            setConInput={setConInput}
            addToList={addToList}
            removeFromList={removeFromList}
            togglePlatform={togglePlatform}
            setStep={setStep}
            canProceed={!!canProceedStep2}
          />
        )}

        {step === 3 && (
          <SubmitLinks
            formData={formData}
            setFormData={setFormData}
            isSubmitting={isSubmitting}
            setStep={setStep}
          />
        )}
      </form>
    </div>
  );
}
