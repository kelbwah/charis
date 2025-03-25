"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import PrayerCard from "@/components/prayer-card";
import { prayers } from "@/lib/data";
import type { Prayer } from "@/lib/types";

export default function DiscoverPage() {
  const [activePrayers, setActivePrayers] = useState<Prayer[]>(prayers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prayedFor, setPrayedFor] = useState<string[]>([]);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [isExiting, setIsExiting] = useState(false);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(
    null,
  );

  const handlePray = (id: string) => {
    setExitDirection("right");
    setIsExiting(true);
    setPrayedFor([...prayedFor, id]);

    toast.success("Added to prayer list", {
      description: "You've committed to pray for this request",
    });

    setTimeout(() => {
      if (currentIndex < activePrayers.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
      setIsExiting(false);
      setExitDirection(null);
    }, 300);
  };

  const handleSkip = (id: string) => {
    setExitDirection("left");
    setIsExiting(true);
    setSkipped([...skipped, id]);

    setTimeout(() => {
      if (currentIndex < activePrayers.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
      setIsExiting(false);
      setExitDirection(null);
    }, 300);
  };

  const currentPrayer = activePrayers[currentIndex];

  return (
    <div className="flex flex-col h-screen">
      {/* Fixed header */}
      <div className="border-b border-primary/10 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to Home</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>

      {/* Main content - truly centered */}
      <div className="flex-1 flex items-center justify-center -translate-y-[1.9rem]">
        <div className="container mx-auto px-4 flex flex-col items-center">
          {currentPrayer ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPrayer.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  x:
                    exitDirection === "left"
                      ? -300
                      : exitDirection === "right"
                        ? 300
                        : 0,
                  transition: { duration: 0.3 },
                }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
              >
                <PrayerCard
                  prayer={currentPrayer}
                  onPray={handlePray}
                  onSkip={handleSkip}
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              className="text-center p-8 bg-card/50 backdrop-blur-sm rounded-lg border border-primary/20 max-w-md w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M17 3.34a10 10 0 1 1 -14.83 8.17" />
                  <path d="M16 8a5 5 0 1 1 -7.5 4.33" />
                </svg>
              </motion.div>
              <h3 className="text-xl font-medium mb-2">
                No more prayer requests
              </h3>
              <p className="text-muted-foreground mb-6">
                You've gone through all the available prayer requests.
              </p>
              <div className="flex flex-col gap-3">
                <Button onClick={() => setCurrentIndex(0)}>Start Over</Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard">View Your Prayer List</Link>
                </Button>
              </div>
            </motion.div>
          )}

          {/* Prayer count indicator */}
          {currentPrayer && (
            <motion.div
              className="mt-6 text-center text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {currentIndex + 1} of {activePrayers.length} prayers
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
