"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import VerifiedClerkSession from "@/components/verified-clerk-session";
import { createPrayer } from "@/services/prayers";
import { useAuth } from "@clerk/nextjs";

export default function SubmitPrayerPage() {
  const router = useRouter();
  const { getToken } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [prayerTitle, setPrayerTitle] = useState("");
  const [prayerRequest, setPrayerRequest] = useState("");
  const [category, setCategory] = useState("");
  const [relatedScripture, setRelatedScripture] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const allCategories = [
    "Health",
    "Family",
    "Financial",
    "Spiritual",
    "Work",
    "Relationships",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = await getToken();
      if (token) {
        await createPrayer(
          {
            prayer_title: prayerTitle,
            prayer_request: prayerRequest,
            category: category,
            related_scripture: relatedScripture,
            is_anonymous: isAnonymous,
          },
          token
        );
      } else {
        throw new Error("Unable to retrieve clerk token. Token may be null.");
      }
      toast.success("Prayer request submitted", {
        description: "Your prayer request has been shared with the community.",
      });
      router.push("/dashboard/my-prayers");
    } catch (error: any) {
      console.error("Error submitting prayer:", error);
      toast.error("Failed to submit prayer request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <VerifiedClerkSession>
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-6">
            Submit a Prayer Request
          </h1>
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle className="text-2xl tracking-tight">
                  Share Your Prayer Need
                </CardTitle>
                <CardDescription>
                  Your prayer request will be shared with the community. Be
                  specific but mindful of privacy.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 mt-7">
                <div className="space-y-2">
                  <Label htmlFor="prayer-title">Title</Label>
                  <Input
                    id="prayer-title"
                    placeholder="Brief title for your prayer request"
                    value={prayerTitle}
                    onChange={(e) => setPrayerTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prayer-request">Prayer Request</Label>
                  <Textarea
                    id="prayer-request"
                    placeholder="Share your prayer need in detail..."
                    className="min-h-[150px]"
                    value={prayerRequest}
                    onChange={(e) => setPrayerRequest(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prayer-category">Category</Label>
                  <Select
                    required
                    onValueChange={(value) => setCategory(value)}
                  >
                    <SelectTrigger
                      id="prayer-category"
                      className="cursor-pointer"
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {allCategories.map((cat) => (
                        <SelectItem
                          key={cat}
                          value={cat.toLowerCase()}
                          className="cursor-pointer"
                        >
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prayer-scripture">
                    Related Scripture (Optional)
                  </Label>
                  <Input
                    id="prayer-scripture"
                    placeholder="Add a Bible verse if relevant"
                    value={relatedScripture}
                    onChange={(e) => setRelatedScripture(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="anonymous">Submit Anonymously</Label>
                    <p className="text-sm text-muted-foreground">
                      Your name won't be displayed with your prayer request
                    </p>
                  </div>
                  <Switch
                    id="anonymous"
                    className="cursor-pointer"
                    checked={isAnonymous}
                    onCheckedChange={setIsAnonymous}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  type="button"
                  className="cursor-pointer"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Prayer Request"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </VerifiedClerkSession>
  );
}
