"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type EmailPreferences = {
  submissionUpdates: boolean;
  reviewStatusUpdates: boolean;
  marketingUpdates: boolean;
};

const DEFAULT_PREFERENCES: EmailPreferences = {
  submissionUpdates: true,
  reviewStatusUpdates: true,
  marketingUpdates: false,
};

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [emailPreferences, setEmailPreferences] = useState<EmailPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const metadataPrefs = user.unsafeMetadata?.emailPreferences as Partial<EmailPreferences> | undefined;
    setEmailPreferences({
      submissionUpdates: metadataPrefs?.submissionUpdates ?? DEFAULT_PREFERENCES.submissionUpdates,
      reviewStatusUpdates: metadataPrefs?.reviewStatusUpdates ?? DEFAULT_PREFERENCES.reviewStatusUpdates,
      marketingUpdates: metadataPrefs?.marketingUpdates ?? DEFAULT_PREFERENCES.marketingUpdates,
    });
  }, [isLoaded, user]);

  const handleToggle = (preference: keyof typeof emailPreferences) => {
    setSaved(false);
    setEmailPreferences((prev) => ({
      ...prev,
      [preference]: !prev[preference],
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    setSaved(false);

    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          emailPreferences,
        },
      });
      setSaved(true);
    } catch (error) {
      console.error("Failed to save email preferences:", error);
      alert("Unable to save preferences right now. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded) {
    return <div className="container mx-auto px-4 py-10 max-w-4xl text-muted-foreground">Loading settings...</div>;
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <Card>
          <CardContent className="p-6 text-muted-foreground">Please sign in to manage email preferences.</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        {saved && (
          <Badge className="gap-1.5">
            <Check className="w-3.5 h-3.5" /> Saved
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <span>Submission confirmations</span>
            <Button variant={emailPreferences.submissionUpdates ? "default" : "outline"} size="sm" onClick={() => handleToggle("submissionUpdates")}>
              {emailPreferences.submissionUpdates ? "On" : "Off"}
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <span>Approval/rejection updates</span>
            <Button variant={emailPreferences.reviewStatusUpdates ? "default" : "outline"} size="sm" onClick={() => handleToggle("reviewStatusUpdates")}>
              {emailPreferences.reviewStatusUpdates ? "On" : "Off"}
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <span>Marketing and product updates</span>
            <Button variant={emailPreferences.marketingUpdates ? "default" : "outline"} size="sm" onClick={() => handleToggle("marketingUpdates")}>
              {emailPreferences.marketingUpdates ? "On" : "Off"}
            </Button>
          </div>

          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Preferences"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}