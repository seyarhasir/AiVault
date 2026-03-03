"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Loader2, Plus, X, Twitter, Github, MessageCircle, Upload, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

const categories = ["Writing", "Image", "Video", "Coding", "Audio", "Design"];
const pricingOptions = ["Free", "Freemium", "Paid"];
const platformOptions = ["Web", "iOS", "Android", "Desktop", "API", "Chrome Extension"];

export default function SubmitTool() {
  const { userId, isLoaded } = useAuth();
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
      await submitTool({
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
        userId,
      });

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

  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
        <h1 className="text-balance text-3xl tracking-tight md:text-4xl">Sign In Required</h1>
        <p className="text-muted-foreground mb-8 tracking-wider">You must be signed in to submit a new tool.</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Card className="bg-primary/10 border-primary/20 p-10">
            <CardContent>
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-4 text-primary tracking-tight">Tool Submitted!</h1>
              <p className="text-muted-foreground tracking-wider">Your tool has been submitted and is pending admin approval. Redirecting to dashboard...</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

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
              className={`w-8 h-8 rounded-full text-sm font-medium flex items-center justify-center shrink-0 transition-colors ${
                s === step ? "bg-primary text-primary-foreground" :
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
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key="step1">
            <Card className="rounded-2xl">
              <CardContent className="p-6 md:p-8 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight mb-1">Basic Information</h2>
                  <p className="text-sm text-muted-foreground">Tell us about the tool.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Tool Name *</label>
                    <Input
                      required value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. ChatGPT"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Website URL *</label>
                    <Input
                      type="url" required value={formData.websiteUrl}
                      onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Logo</label>
                    <p className="text-xs text-muted-foreground mb-2">Upload a logo image or paste a URL. Max 2MB.</p>
                    
                    <div className="flex gap-2 mb-3">
                      <Button
                        type="button"
                        variant={logoInputType === "url" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setLogoInputType("url")}
                        className="gap-2"
                      >
                        <LinkIcon className="w-4 h-4" />
                        URL
                      </Button>
                      <Button
                        type="button"
                        variant={logoInputType === "upload" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setLogoInputType("upload")}
                        className="gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Upload
                      </Button>
                    </div>

                    {logoInputType === "url" ? (
                      <Input
                        type="url" 
                        value={formData.logoUrl}
                        onChange={(e) => {
                          setFormData({ ...formData, logoUrl: e.target.value });
                          setLogoPreview("");
                          setLogoFile(null);
                        }}
                        placeholder="https://logos.hunter.io/yourdomain.com"
                      />
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleLogoFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full"
                        >
                          {logoFile ? logoFile.name : "Choose file..."}
                        </Button>
                        {logoFile && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={clearLogoFile}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    )}

                    {(logoPreview || (formData.logoUrl && (formData.logoUrl.startsWith('http://') || formData.logoUrl.startsWith('https://') || formData.logoUrl.startsWith('data:')))) && (
                      <div className="mt-3 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-secondary border border-border relative">
                          <Image 
                            src={logoPreview || formData.logoUrl} 
                            alt="Preview" 
                            fill 
                            className="object-cover" 
                            referrerPolicy="no-referrer" 
                            unoptimized={!!logoPreview}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">Logo preview</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Short Description *</label>
                    <Textarea
                      required rows={2} value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="A brief one-liner about what this tool does"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Detailed Description</label>
                    <Textarea
                      rows={4} value={formData.longDescription}
                      onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                      placeholder="A longer explanation of the tool, its capabilities, and what makes it unique..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-secondary border border-border rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all appearance-none"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat} className="bg-card">{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Pricing *</label>
                      <select
                        value={formData.pricing}
                        onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                        className="w-full bg-secondary border border-border rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all appearance-none"
                      >
                        {pricingOptions.map((p) => (
                          <option key={p} value={p} className="bg-card">{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Pricing Details</label>
                    <Input
                      value={formData.pricingDetails}
                      onChange={(e) => setFormData({ ...formData, pricingDetails: e.target.value })}
                      placeholder="e.g. Free tier available. Pro from $20/mo"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="button" onClick={() => setStep(2)} disabled={!canProceedStep1}>
                    Next Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Features & Details */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key="step2">
            <Card className="rounded-2xl">
              <CardContent className="p-6 md:p-8 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight mb-1">Features & Details</h2>
                  <p className="text-sm text-muted-foreground">The more detail, the better the listing.</p>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Tags * (at least 1)</label>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addToList("tags", tagInput, setTagInput); }}}
                      placeholder="Type a tag and press Enter"
                    />
                    <Button type="button" variant="outline" size="icon" onClick={() => addToList("tags", tagInput, setTagInput)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="gap-1">
                          {tag}
                          <button type="button" onClick={() => removeFromList("tags", i)}><X className="w-3 h-3" /></button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Platforms */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Platforms</label>
                  <div className="flex flex-wrap gap-2">
                    {platformOptions.map((p) => (
                      <button
                        key={p} type="button" onClick={() => togglePlatform(p)}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                          formData.platforms.includes(p)
                            ? "bg-primary/20 text-primary border-primary/30"
                            : "bg-secondary text-muted-foreground border-border hover:border-primary/30"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Key Features</label>
                  <div className="flex gap-2">
                    <Input
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addToList("features", featureInput, setFeatureInput); }}}
                      placeholder="e.g. Real-time collaboration"
                    />
                    <Button type="button" variant="outline" size="icon" onClick={() => addToList("features", featureInput, setFeatureInput)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {formData.features.length > 0 && (
                    <div className="space-y-1 mt-2">
                      {formData.features.map((f, i) => (
                        <div key={i} className="flex items-center justify-between text-sm bg-secondary/50 rounded-lg px-3 py-2 border border-border">
                          <span>{f}</span>
                          <button type="button" onClick={() => removeFromList("features", i)}><X className="w-3 h-3 text-muted-foreground" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Use Cases */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Use Cases</label>
                  <div className="flex gap-2">
                    <Input
                      value={useCaseInput}
                      onChange={(e) => setUseCaseInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addToList("useCases", useCaseInput, setUseCaseInput); }}}
                      placeholder="e.g. Content writing for blogs"
                    />
                    <Button type="button" variant="outline" size="icon" onClick={() => addToList("useCases", useCaseInput, setUseCaseInput)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {formData.useCases.length > 0 && (
                    <div className="space-y-1 mt-2">
                      {formData.useCases.map((uc, i) => (
                        <div key={i} className="flex items-center justify-between text-sm bg-secondary/50 rounded-lg px-3 py-2 border border-border">
                          <span>{uc}</span>
                          <button type="button" onClick={() => removeFromList("useCases", i)}><X className="w-3 h-3 text-muted-foreground" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pros & Cons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Pros</label>
                    <div className="flex gap-2">
                      <Input
                        value={proInput}
                        onChange={(e) => setProInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addToList("pros", proInput, setProInput); }}}
                        placeholder="Add a pro"
                      />
                      <Button type="button" variant="outline" size="icon" onClick={() => addToList("pros", proInput, setProInput)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {formData.pros.length > 0 && (
                      <div className="space-y-1 mt-2">
                        {formData.pros.map((p, i) => (
                          <div key={i} className="flex items-center justify-between text-sm bg-secondary/50 rounded-lg px-3 py-2 border border-border">
                            <span className="text-green-500 mr-1">+</span> <span className="flex-1">{p}</span>
                            <button type="button" onClick={() => removeFromList("pros", i)}><X className="w-3 h-3 text-muted-foreground" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Cons</label>
                    <div className="flex gap-2">
                      <Input
                        value={conInput}
                        onChange={(e) => setConInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addToList("cons", conInput, setConInput); }}}
                        placeholder="Add a con"
                      />
                      <Button type="button" variant="outline" size="icon" onClick={() => addToList("cons", conInput, setConInput)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {formData.cons.length > 0 && (
                      <div className="space-y-1 mt-2">
                        {formData.cons.map((c, i) => (
                          <div key={i} className="flex items-center justify-between text-sm bg-secondary/50 rounded-lg px-3 py-2 border border-border">
                            <span className="text-red-500 mr-1">-</span> <span className="flex-1">{c}</span>
                            <button type="button" onClick={() => removeFromList("cons", i)}><X className="w-3 h-3 text-muted-foreground" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button type="button" onClick={() => setStep(3)} disabled={!canProceedStep2}>Next Step</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Social Links & Review */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key="step3">
            <Card className="rounded-2xl">
              <CardContent className="p-6 md:p-8 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight mb-1">Links & Review</h2>
                  <p className="text-sm text-muted-foreground">Add social links and review your submission.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 flex items-center gap-2">
                      <Twitter className="w-4 h-4" /> Twitter / X URL
                    </label>
                    <Input
                      type="url" value={formData.twitterUrl}
                      onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 flex items-center gap-2">
                      <Github className="w-4 h-4" /> GitHub URL
                    </label>
                    <Input
                      type="url" value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" /> Discord URL
                    </label>
                    <Input
                      type="url" value={formData.discordUrl}
                      onChange={(e) => setFormData({ ...formData, discordUrl: e.target.value })}
                      placeholder="https://discord.gg/..."
                    />
                  </div>
                </div>

                <Separator />

                {/* Review Summary */}
                <div>
                  <h3 className="font-semibold tracking-tight mb-3">Submission Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-medium">{formData.name}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Category</span><span className="font-medium">{formData.category}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Pricing</span><span className="font-medium">{formData.pricing}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Tags</span><span className="font-medium">{formData.tags.join(", ")}</span></div>
                    {formData.features.length > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Features</span><span className="font-medium">{formData.features.length} listed</span></div>}
                    {formData.platforms.length > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Platforms</span><span className="font-medium">{formData.platforms.join(", ")}</span></div>}
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
                  <Button type="submit" disabled={isSubmitting} size="lg" className="min-w-[160px]">
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Submitting...</>
                    ) : (
                      "Submit Tool"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </form>
    </div>
  );
}
