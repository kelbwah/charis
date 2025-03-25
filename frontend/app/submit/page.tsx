"use client";

import type React from "react";

import { useState } from "react";
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

export default function SubmitPrayerPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Prayer request submitted", {
        description: "Your prayer request has been shared with the community.",
      });
      router.push("/dashboard/my-prayers");
    }, 1500);
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
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prayer-content">Prayer Request</Label>
                <Textarea
                  id="prayer-content"
                  placeholder="Share your prayer need in detail..."
                  className="min-h-[150px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prayer-category">Category</Label>
                <Select>
                  <SelectTrigger
                    className="cursor-pointer"
                    id="prayer-category"
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem className="cursor-pointer" value="health">
                      Health
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="family">
                      Family
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="financial">
                      Financial
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="spiritual">
                      Spiritual
                    </SelectItem>
                    <SelectItem
                      className="cursor-pointer"
                      value="relationships"
                    >
                      Relationships
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="work">
                      Work
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="other">
                      Other
                    </SelectItem>
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
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="anonymous">Submit Anonymously</Label>
                  <p className="text-sm text-muted-foreground">
                    Your name won't be displayed with your prayer request
                  </p>
                </div>
                <Switch id="anonymous" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Receive Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone prays for you
                  </p>
                </div>
                <Switch id="notifications" defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between mt-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.back()}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                className="cursor-pointer"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Prayer Request"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
