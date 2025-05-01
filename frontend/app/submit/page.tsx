"use client";

import React from "react";
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
import { createPrayer } from "@/services/prayers";
import { useStore } from "@/store/useStore";

export default function SubmitPrayerPage() {
  const router = useRouter();

  const { submit, setSubmit } = useStore();

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
    setSubmit({ isSubmitting: true });

    try {
      await createPrayer({
        prayer_title: submit.title,
        prayer_request: submit.request,
        category: submit.category,
        related_scripture: submit.scripture,
        is_anonymous: submit.anonymous,
      });
      toast.success("Prayer request submitted", {
        description: "Your prayer request has been shared with the community.",
      });
      router.push("/dashboard/my-prayers");
    } catch (error: any) {
      console.error("Error submitting prayer:", error);
      toast.error("Failed to submit prayer request");
    } finally {
      setSubmit({ isSubmitting: false });
    }
  };

  return (
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
                  value={submit.title}
                  onChange={(e) => setSubmit({ title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prayer-request">Prayer Request</Label>
                <Textarea
                  id="prayer-request"
                  placeholder="Share your prayer need in detail..."
                  className="min-h-[150px]"
                  value={submit.request}
                  onChange={(e) => setSubmit({ request: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prayer-category">Category</Label>
                <Select
                  required
                  onValueChange={(value) => setSubmit({ category: value })}
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
                  value={submit.scripture}
                  onChange={(e) => setSubmit({ scripture: e.target.value })}
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
                  checked={submit.anonymous}
                  onCheckedChange={() =>
                    setSubmit({ anonymous: !submit.anonymous })
                  }
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
                disabled={submit.isSubmitting}
              >
                {submit.isSubmitting
                  ? "Submitting..."
                  : "Submit Prayer Request"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
