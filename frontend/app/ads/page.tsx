import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdsPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter">
            Advertising Options
          </h1>
          <p className="text-muted-foreground">
            Learn about our non-intrusive advertising options for Charis.
          </p>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="formats">Ad Formats</TabsTrigger>
            <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 pt-6">
            <p>
              Charis offers thoughtful, non-intrusive advertising opportunities
              that respect our users' prayer experience while providing value to
              advertisers and supporting our platform.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Our Approach</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    We believe advertising can be respectful and relevant. Our
                    ads are carefully placed to minimize disruption while
                    maximizing visibility for advertisers who share our values.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Targeted Audience</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Reach a community of faith-minded individuals who are
                    actively engaged in prayer and spiritual growth. Our
                    platform offers unique demographic targeting opportunities.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Google AdSense Integration</CardTitle>
                <CardDescription>
                  We use Google AdSense to deliver relevant, content-appropriate
                  ads.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Google AdSense allows us to show ads that are:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Relevant to our users' interests</li>
                  <li>Filtered for appropriate content</li>
                  <li>Optimized for performance</li>
                  <li>Responsive across all devices</li>
                </ul>
                <p>
                  We've carefully configured our AdSense implementation to
                  ensure ads complement rather than detract from the prayer
                  experience.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="formats" className="space-y-6 pt-6">
            <p>
              We offer several ad formats designed to be effective while
              respecting the user experience.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Banner Ads</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-[4/1] bg-muted rounded-md flex items-center justify-center text-muted-foreground text-sm border">
                    Banner Ad Example (728×90)
                  </div>
                  <p>
                    Placed at the bottom of the screen or between content
                    sections, our banner ads provide visibility without
                    interrupting the prayer experience.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sidebar Ads</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-[1/2] max-w-[160px] mx-auto bg-muted rounded-md flex items-center justify-center text-muted-foreground text-sm border">
                    Sidebar Ad Example (160×600)
                  </div>
                  <p>
                    Displayed in the sidebar on desktop views, these ads provide
                    excellent visibility while users browse prayer requests.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Native Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-md border">
                  <div className="text-xs text-muted-foreground mb-2">
                    Sponsored
                  </div>
                  <h3 className="text-sm font-medium mb-1">
                    Faith-Based Resources for Your Journey
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Discover books, courses, and tools to deepen your prayer
                    life and spiritual growth.
                  </p>
                </div>
                <p>
                  Native ads blend seamlessly with the platform's content,
                  providing value to users while promoting relevant products or
                  services. These are clearly marked as sponsored content.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interstitial Ads</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Shown at natural transition points (such as after marking a
                  prayer as complete), these full-screen ads appear infrequently
                  and include a prominent close button.
                </p>
                <div className="p-6 bg-muted rounded-md border flex flex-col items-center justify-center gap-4">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-2">
                      Advertisement
                    </div>
                    <h3 className="text-lg font-medium mb-1">Special Offer</h3>
                    <p className="text-sm text-muted-foreground">
                      Faith-based content relevant to our community
                    </p>
                  </div>
                  <div className="flex justify-end w-full">
                    <div className="text-xs border rounded-full px-2 py-1">
                      Close ×
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guidelines" className="space-y-6 pt-6">
            <p>
              We maintain strict guidelines to ensure all advertisements align
              with our community values.
            </p>

            <Card>
              <CardHeader>
                <CardTitle>Content Restrictions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li>No content that contradicts core Christian values</li>
                  <li>No political advertisements</li>
                  <li>No gambling, alcohol, or tobacco products</li>
                  <li>No misleading claims or deceptive practices</li>
                  <li>No inappropriate or adult content</li>
                  <li>No aggressive animations or disruptive elements</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Experience Principles</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Ads must not interfere with the core prayer experience
                  </li>
                  <li>Ad frequency is limited to prevent fatigue</li>
                  <li>
                    All ads must be clearly distinguishable from platform
                    content
                  </li>
                  <li>
                    Ads must be responsive and perform well on all devices
                  </li>
                  <li>
                    Sound is disabled by default on all video advertisements
                  </li>
                  <li>
                    Users can report inappropriate ads for immediate review
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ideal Advertising Partners</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  We welcome partnerships with organizations that align with our
                  mission and values:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Faith-based organizations and ministries</li>
                  <li>Christian publishers and educational resources</li>
                  <li>Charitable and humanitarian organizations</li>
                  <li>Family-friendly products and services</li>
                  <li>Mental health and wellness resources</li>
                  <li>Community-building tools and platforms</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
