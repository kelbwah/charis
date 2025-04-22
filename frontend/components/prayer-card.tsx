"use client";

import { useRef, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { Flag, MoreHorizontal, X, BookOpen, Quote, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PrayerCardSkeleton } from "./prayer-card-skeleton";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { Prayer } from "@/services/types";
import { getUserById } from "@/services/users";
import { getPrayerCountById } from "@/services/prayers";
import { Badge } from "./ui/badge";
import { useStore } from "@/store/useStore";
import { useUIStore } from "@/store/uiStore";

interface PrayerCardProps {
  prayer: Prayer;
  onPray?: (id: string) => Promise<void>;
  onSkip?: (id: string) => Promise<void>;
}

export default function PrayerCard({
  prayer,
  onPray,
  onSkip,
}: PrayerCardProps) {
  const { loading, setLoading } = useUIStore();
  const { prayerCard, setPrayerCard } = useStore();

  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Motion values for drag effects.
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  // Swipe feedback animations
  const prayScale = useTransform(x, [-100, 0, 100, 200], [0.5, 0.5, 1.2, 1.5]);
  const skipScale = useTransform(x, [-200, -100, 0, 100], [1.5, 1.2, 0.5, 0.5]);
  const prayOpacity = useTransform(x, [-100, 0, 100, 200], [0, 0, 0.8, 1]);
  const skipOpacity = useTransform(x, [-200, -100, 0, 100], [1, 0.8, 0, 0]);

  // Fetch user and prayer count info.
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      if (!prayer) return;
      try {
        const { data: userData } = await getUserById(prayer.user_id);
        setPrayerCard({ user: userData });
        const { data: prayerCountData } = await getPrayerCountById(prayer.id);
        setPrayerCard({ count: prayerCountData.WillPrayCount });
      } catch (error) {
        console.error("Error fetching user or prayer count", error);
      }
      setLoading(false);
    }
    fetchData();
  }, [prayer]);

  const timeDisplay = new Date(prayer.created_at).toLocaleString();
  const displayName = prayer.is_anonymous
    ? "Anonymous"
    : prayerCard.user
    ? prayerCard.user.username
    : "Loading...";
  const avatarInitials = prayer.is_anonymous
    ? "AN"
    : prayerCard.user
    ? prayerCard.user.username.slice(0, 2).toUpperCase()
    : "";

  const handleDragEnd = async (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x > 100) {
      setPrayerCard({ direction: "right" });
      setPrayerCard({ exitX: 200 });
      if (onPray) {
        setTimeout(async () => {
          await onPray(prayer.id);
        }, 300);
      }
    } else if (info.offset.x < -100) {
      setPrayerCard({ direction: "left" });
      setPrayerCard({ exitX: -200 });
      if (onSkip) {
        setTimeout(async () => {
          await onSkip(prayer.id);
        }, 300);
      }
    }
  };

  const formattedCategory = prayer.category
    ? prayer.category.charAt(0).toUpperCase() + prayer.category.slice(1)
    : "";
  const hasScripture =
    prayer.related_scripture && prayer.related_scripture.trim() !== "";

  if (loading) {
    return <PrayerCardSkeleton showButtonActions={true} />;
  }

  return (
    <>
      <div className="relative">
        <motion.div
          ref={cardRef}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          style={{ x, rotate, opacity }}
          onDragEnd={handleDragEnd}
          animate={prayerCard.direction ? { x: prayerCard.exitX } : undefined}
          transition={prayerCard.direction ? { duration: 0.3 } : undefined}
          className="cursor-grab relative z-10"
        >
          <Card className="w-full max-w-md mx-auto overflow-hidden border-2 shadow-lg relative p-0">
            {/* Pray indicator overlay */}
            <motion.div
              className="absolute inset-0 bg-green-500/20 z-10 flex items-center justify-center rounded-lg"
              style={{ opacity: prayOpacity }}
            >
              <motion.div style={{ scale: prayScale }}>
                <Check className="h-20 w-20 text-green-500" />
              </motion.div>
            </motion.div>

            {/* Skip indicator overlay */}
            <motion.div
              className="absolute inset-0 bg-red-500/20 z-10 flex items-center justify-center rounded-lg"
              style={{ opacity: skipOpacity }}
            >
              <motion.div style={{ scale: skipScale }}>
                <X className="h-20 w-20 text-red-500" />
              </motion.div>
            </motion.div>

            <CardHeader className="flex flex-row items-center gap-3 p-4 pb-0 bg-gradient-to-b from-primary/10 to-transparent">
              <Avatar>
                {!prayer.is_anonymous &&
                prayerCard.user &&
                prayerCard.user.avatar_src ? (
                  <AvatarImage
                    src={prayerCard.user.avatar_src || "/placeholder.svg"}
                    alt={displayName}
                  />
                ) : (
                  <AvatarFallback>{avatarInitials}</AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <div className="font-medium">{displayName}</div>
                <div className="text-xs text-muted-foreground">
                  {timeDisplay}
                </div>
              </div>
              <Badge
                variant="outline"
                className="bg-primary/5 border-primary/20 text-xs font-medium"
              >
                {formattedCategory}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setPrayerCard({ showReport: true })}
                  >
                    <Flag className="mr-2 h-4 w-4" /> Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>

            {prayer.prayer_title && prayer.prayer_title.trim() !== "" && (
              <div className="px-5 pt-3 pb-1">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="h-4 w-4 text-primary flex-shrink-0" />
                  <h3 className="text-lg font-semibold tracking-tight text-primary truncate">
                    {prayer.prayer_title}
                  </h3>
                </div>
              </div>
            )}

            <CardContent className="py-2 px-5 relative">
              <div
                ref={contentRef}
                className="h-[120px] overflow-y-auto pr-2 relative z-10"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(var(--primary), 0.2) transparent",
                }}
                onClick={(e) => e.stopPropagation()} // Prevent drag when clicking content
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-muted-foreground leading-relaxed"
                >
                  {prayer.prayer_request}
                </motion.p>
              </div>
            </CardContent>

            {hasScripture && (
              <div className="px-5 pb-2">
                <div
                  className="bg-primary/5 rounded-md p-3 border border-primary/10 max-h-[80px] overflow-y-auto"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(var(--primary), 0.2) transparent",
                  }}
                  onClick={(e) => e.stopPropagation()} // Prevent drag when clicking scripture
                >
                  <div className="flex items-start gap-2">
                    <Quote className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm italic text-foreground">
                      {prayer.related_scripture}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <CardFooter className="flex justify-between text-center items-center pt-4 pb-4.5 px-5 mt-1 border-t border-primary/10 bg-card/50">
              <div className="flex items-center text-sm text-muted-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary mr-1.5"
                >
                  <path d="M17 2.1l4 4-4 4" />
                  <path d="M3 12.2v-2a4 4 0 0 1 4-4h12.8" />
                  <path d="M7 21.9l-4-4 4-4" />
                  <path d="M21 11.8v2a4 4 0 0 1-4 4H4.2" />
                </svg>
                <span>
                  {prayerCard.count}{" "}
                  {prayerCard.count === 1 ? "person" : "people"} praying
                </span>
              </div>
              <div className="text-xs text-muted-foreground flex items-center">
                <span className="text-destructive font-bold">
                  Swipe left to skip
                </span>
                <span className="mx-2">|</span>
                <span className="text-primary font-bold">
                  Swipe right to pray
                </span>
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        <div className="flex justify-center gap-4 mt-6">
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full border-2 border-destructive text-destructive"
            onClick={() => {
              setPrayerCard({ direction: "left" });
              setPrayerCard({ exitX: -200 });
              if (onSkip) {
                setTimeout(async () => {
                  await onSkip(prayer.id);
                }, 300);
              }
            }}
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Skip</span>
          </Button>
          <Button
            size="icon"
            className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 relative overflow-hidden"
            onClick={() => {
              setPrayerCard({ direction: "right" });
              setPrayerCard({ exitX: 200 });
              if (onPray) {
                setTimeout(async () => {
                  await onPray(prayer.id);
                }, 300);
              }
            }}
          >
            <span className="relative z-10">
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
                <path d="M3 12.2v-2a4 4 0 0 1 4-4h12.8" />
                <path d="M7 21.9l-4-4 4-4" />
                <path d="M21 11.8v2a4 4 0 0 1-4 4H4.2" />
              </svg>
            </span>
            <span className="sr-only">Pray</span>
          </Button>
        </div>
      </div>

      <Dialog
        open={prayerCard.showReport}
        onOpenChange={() =>
          setPrayerCard({ showReport: !prayerCard.showReport })
        }
      >
        <DialogContent className="bg-card border-primary/20">
          <DialogHeader>
            <DialogTitle>Report Prayer Request</DialogTitle>
            <DialogDescription>
              Please let us know why you're reporting this prayer request.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Please explain why you're reporting this prayer request..."
              className="border-primary/20"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPrayerCard({ showReport: false })}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setPrayerCard({ showReport: false });
                toast.success("Report submitted", {
                  description: "Thank you for helping keep our community safe.",
                });
              }}
            >
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
