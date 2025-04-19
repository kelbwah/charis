import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            About Charis
          </h1>
          <p className="text-xl text-muted-foreground">
            Connecting believers through the power of prayer
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Our Mission</h2>
          <p className="leading-7">
            Charis was created with a simple but powerful mission: to connect
            believers around the world through prayer. We believe in the
            transformative power of prayer and the strength that comes from a
            community united in faith.
          </p>
          <p className="leading-7">
            Our platform provides a safe, respectful space where people can
            share their prayer needs, commit to pray for others, and experience
            the encouragement that comes from knowing others are praying for
            them.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">How It Works</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M17 6.1H3" />
                  <path d="M21 12.1H3" />
                  <path d="M15.1 18H3" />
                </svg>
              </div>
              <h3 className="text-xl font-medium">Share</h3>
              <p className="text-muted-foreground">
                Submit your prayer requests to the community. Be as specific or
                general as you feel comfortable.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M17 2.1l4 4-4 4" />
                  <path d="M3 12.2v-2a4 4 0 0 1 4-4h12.8M7 21.9l-4-4 4-4" />
                  <path d="M21 11.8v2a4 4 0 0 1-4 4H4.2" />
                </svg>
              </div>
              <h3 className="text-xl font-medium">Pray</h3>
              <p className="text-muted-foreground">
                Browse prayer requests and commit to pray for those that touch
                your heart. Swipe right to pray, left to pass.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                  <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                </svg>
              </div>
              <h3 className="text-xl font-medium">Connect</h3>
              <p className="text-muted-foreground">
                Send messages of encouragement to those you're praying for.
                Build a community of support and faith.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Our Values</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-xl font-medium">Respect</h3>
              <p className="text-muted-foreground">
                We honor all faith traditions and ensure a respectful
                environment for all users.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-medium">Privacy</h3>
              <p className="text-muted-foreground">
                Your personal information is protected, and you control what you
                share.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-medium">Community</h3>
              <p className="text-muted-foreground">
                We foster a supportive community where everyone feels welcome
                and valued.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-medium">Authenticity</h3>
              <p className="text-muted-foreground">
                We encourage genuine connections and sincere prayer commitments.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 text-center">
          <h2 className="text-2xl font-semibold">Join Our Community</h2>
          <p className="leading-7">
            Whether you're seeking prayer or wanting to pray for others, we
            invite you to become part of our growing community.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/prayers">Start Praying</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/submit">Submit Prayer</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
