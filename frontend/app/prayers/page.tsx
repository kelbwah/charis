"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Filter, SortDesc, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import PrayerCard from "@/components/prayer-card";
import VerifiedClerkSession from "@/components/verified-clerk-session";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetDescription,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PrayerCardSkeleton } from "@/components/prayer-card-skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createPrayerResponse, getAllPrayers } from "@/services/prayers";
import { Prayer } from "@/services/types";
import { useAuth } from "@clerk/nextjs";
import DonationBanner from "@/components/donation-banner";

export default function DiscoverPage() {
  // Local state declarations.
  const [activePrayers, setActivePrayers] = useState<Prayer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prayedFor, setPrayedFor] = useState<string[]>([]);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [isExiting, setIsExiting] = useState(false);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAnonymous, setShowAnonymous] = useState(true);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  const [cursor, setCursor] = useState<string>("");
  const cursorRef = useRef<string>("");

  const [hasMore, setHasMore] = useState<boolean>(true);

  const { getToken } = useAuth();

  const allCategories = [
    "Health",
    "Family",
    "Financial",
    "Spiritual",
    "Work",
    "Relationships",
  ];

  const pulseAnimation = {
    scale: [1, 1.2, 1],
    opacity: [0.9, 1, 0.9],
    transition: {
      duration: 2.5,
      ease: "easeInOut",
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse" as const,
    },
  };

  const buildQueryString = (cursorValue: string) => {
    const params = new URLSearchParams();
    params.append("limit", "15");
    params.append("sort", sortBy);
    params.append("show_anonymous", showAnonymous.toString());
    if (selectedCategory) {
      params.append("category", selectedCategory);
    }
    if (cursorValue) {
      params.append("cursor", cursorValue);
    } else {
      params.append(
        "cursor",
        sortBy === "newest"
          ? new Date().toISOString()
          : new Date(0).toISOString()
      );
    }
    return params.toString();
  };

  const loadPrayers = useCallback(
    async (append: boolean = false) => {
      const token = await getToken();
      setIsLoading(true);
      try {
        const queryString = buildQueryString(cursorRef.current);
        const response = await getAllPrayers(queryString);
        const data: Prayer[] = response.data;
        if (!append) {
          setActivePrayers(data);
          setCurrentIndex(0);
        } else {
          setActivePrayers((prev) => [...prev, ...data]);
        }
        if (data.length > 0) {
          const newCursor = data[data.length - 1].created_at;
          setCursor(newCursor);
          cursorRef.current = newCursor;
        }
        setHasMore(data.length === 20);
      } catch (error: any) {
        toast.error("Failed to load prayers");
      } finally {
        setIsLoading(false);
      }
    },
    [selectedCategory, showAnonymous, sortBy, getToken]
  );

  useEffect(() => {
    setCursor("");
    cursorRef.current = "";
    setHasMore(true);
    loadPrayers(false);
  }, [selectedCategory, showAnonymous, sortBy, getToken, loadPrayers]);

  const loadMorePrayers = async () => {
    if (!hasMore || isLoading) return;
    await loadPrayers(true);
  };

  const handleSwipe = async (id: string, action: "will_pray" | "not_now") => {
    setExitDirection(action === "will_pray" ? "right" : "left");
    setIsExiting(true);
    action === "will_pray"
      ? setPrayedFor((prev) => [...prev, id])
      : setSkipped((prev) => [...prev, id]);

    const token = await getToken();
    try {
      await createPrayerResponse(id, action);
      toast.success(
        action === "will_pray" ? "Added to prayer list" : "Skipped prayer",
        {
          description:
            action === "will_pray"
              ? "You've committed to pray for this request"
              : "You've decided to skip that prayer request.",
        }
      );
    } catch (error: any) {
      toast.error("Failed to respond to prayer.");
    }

    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= activePrayers.length && hasMore) {
        loadMorePrayers();
      }
      setCurrentIndex(nextIndex);
      setIsExiting(false);
      setExitDirection(null);
    }, 300);
  };

  const handlePray = async (id: string) => {
    await handleSwipe(id, "will_pray");
  };

  const handleSkip = async (id: string) => {
    await handleSwipe(id, "not_now");
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  const currentPrayer = activePrayers[currentIndex];

  return (
    <VerifiedClerkSession>
      <div className="flex flex-col min-h-[calc(100vh-var(--navbar-height)-var(--footer-height))]">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-primary/10 bg-background/95 backdrop-blur-sm h-16 flex items-center">
          <div className="container flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="h-5 w-5" />
                  <span className="sr-only">Back to Home</span>
                </Link>
              </Button>
              <h1 className="text-xl font-semibold hidden md:flex">
                Discover Prayers
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 h-9 px-3 border-primary/20 hover:bg-primary/5 cursor-pointer"
                  >
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </SheetTrigger>
                <SheetContent className="p-0 border-l border-primary/20 min-h-screen overflow-auto">
                  <div className="px-2 py-4 border-b border-primary/10 bg-primary/5">
                    <SheetHeader className="text-left mb-0">
                      <SheetTitle className="text-xl">
                        Filter Prayers
                      </SheetTitle>
                      <SheetDescription>
                        Customize your prayer discovery
                      </SheetDescription>
                    </SheetHeader>
                  </div>
                  <div className="px-6 py-4 space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Sort By</h3>
                      <RadioGroup
                        defaultValue={sortBy}
                        onValueChange={(value) =>
                          setSortBy(value as "newest" | "oldest")
                        }
                        className="grid grid-cols-1 gap-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="newest" id="newest" />
                          <Label
                            htmlFor="newest"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <SortDesc className="h-4 w-4" />
                            Newest First
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="oldest" id="oldest" />
                          <Label
                            htmlFor="oldest"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <SortAsc className="h-4 w-4" />
                            Oldest First
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="anonymous-prayers">
                          Anonymous Prayers
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Show prayers from anonymous users
                        </p>
                      </div>
                      <Switch
                        id="anonymous-prayers"
                        checked={showAnonymous}
                        onCheckedChange={setShowAnonymous}
                        className="cursor-pointer"
                      />
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">Categories</h3>
                        {selectedCategory && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCategorySelect(null)}
                            className="h-8 text-xs hover:bg-primary/5 cursor-pointer"
                          >
                            Clear filter
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <SheetClose asChild>
                          <Button
                            variant={
                              selectedCategory === null ? "default" : "outline"
                            }
                            size="sm"
                            className="justify-start h-10 text-sm w-full cursor-pointer"
                            onClick={() => handleCategorySelect(null)}
                          >
                            All Prayers
                          </Button>
                        </SheetClose>
                        {allCategories.map((cat) => (
                          <SheetClose asChild key={cat}>
                            <Button
                              variant={
                                selectedCategory === cat ? "default" : "outline"
                              }
                              size="sm"
                              className="justify-start h-10 text-sm w-full cursor-pointer"
                              onClick={() => handleCategorySelect(cat)}
                            >
                              {cat}
                            </Button>
                          </SheetClose>
                        ))}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <Button variant="ghost" size="sm" className="h-9" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Horizontal scroll for categories */}
        <div className="border-b border-primary/10 h-14 flex items-center bg-background/80 px-4">
          <div className="container px-4 md:px-6">
            <ScrollArea className="w-full">
              <div className="flex space-x-2 py-1">
                <Badge
                  variant={selectedCategory === null ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/90 transition-colors h-8 px-3 text-sm whitespace-nowrap"
                  onClick={() => handleCategorySelect(null)}
                >
                  All Prayers
                </Badge>
                {allCategories.map((cat) => (
                  <Badge
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/90 transition-colors h-8 px-3 text-sm whitespace-nowrap"
                    onClick={() => handleCategorySelect(cat)}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="h-2" />
            </ScrollArea>
          </div>
        </div>

        {/* Prayer card display */}
        <div className="flex-1 flex flex-col justify-between items-center px-4 py-8">
          <div className="w-full max-w-md mx-auto">
            {isLoading ? (
              <PrayerCardSkeleton showButtonActions={true} />
            ) : currentPrayer ? (
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
                  className="w-full"
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
                className="text-center p-8 bg-card/50 backdrop-blur-sm rounded-lg border border-primary/20 w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2,
                    ease: [0.43, 0.13, 0.23, 0.96],
                  }}
                  className="mx-auto mb-6 relative w-[4.5rem] h-[4.5rem]"
                >
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/20"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
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
                </motion.div>
                <h3 className="text-xl font-medium mb-3">No prayers found</h3>
                <p className="text-muted-foreground mb-6">
                  {selectedCategory
                    ? `No prayer requests found in the "${selectedCategory}" category.`
                    : "No prayer requests available with your current filters."}
                </p>
                <div className="flex flex-col gap-3">
                  {selectedCategory && (
                    <Button
                      className="cursor-pointer"
                      onClick={() => handleCategorySelect(null)}
                    >
                      View All Prayers
                    </Button>
                  )}
                  <Button variant="outline" asChild>
                    <Link href="/dashboard">View Your Prayer List</Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <DonationBanner isFixed={true} />
    </VerifiedClerkSession>
  );
}
