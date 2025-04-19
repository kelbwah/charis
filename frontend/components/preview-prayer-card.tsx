"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { Flag, MessageCircle, MoreHorizontal, X, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";

export default function PreviewPrayerCard() {
  // Hardcoded mock prayer data.
  const mockPrayer = {
    id: "mock-123",
    prayer_request:
      "Please pray for my recovery from surgery and strength during this time.",
    category: "Health",
    created_at: new Date().toISOString(),
    is_anonymous: false,
    user_id: "mock-user-123",
  };

  // Hardcoded mock user data.
  const mockUser = { username: "Samantha", avatarUrl: "/placeholder-avatar.png" };

  const [showReport, setShowReport] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [exitX, setExitX] = useState(0);

  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const prayScale = useTransform(x, [-100, 0, 100, 200], [0.5, 0.5, 1.2, 1.5]);
  const skipScale = useTransform(x, [-200, -100, 0, 100], [1.5, 1.2, 0.5, 0.5]);
  const prayOpacity = useTransform(x, [-100, 0, 100, 200], [0, 0, 0.8, 1]);
  const skipOpacity = useTransform(x, [-200, -100, 0, 100], [1, 0.8, 0, 0]);

  const timeDisplay = new Date(mockPrayer.created_at).toLocaleString();
  const displayName = mockPrayer.is_anonymous ? "Anonymous" : mockUser.username;
  const avatarInitials = mockPrayer.is_anonymous
    ? "AN"
    : mockUser.username.slice(0, 2).toUpperCase();

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    return;
  };

  return (
    <>
      <div className="relative">
        <motion.div
          ref={cardRef}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          style={{ x, rotate, opacity }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          whileTap={{ cursor: "grabbing" }}
          animate={direction ? { x: exitX } : undefined}
          transition={direction ? { duration: 0.3 } : undefined}
          className="cursor-grab relative z-10"
        >
          <Card className="w-full max-w-md mx-auto overflow-hidden border-2 shadow-lg relative p-0">
            {/* Pray indicator overlay */}
            <motion.div
              className="absolute inset-0 bg-green-500/20 z-10 flex items-center justify-center rounded-lg"
              style={{ opacity: prayOpacity }}
            >
              <motion.div style={{ scale: prayScale }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-500"
                >
                  <path d="M17 2.1l4 4-4 4" />
                  <path d="M3 12.2v-2a4 4 0 0 1 4-4h12.8M7 21.9l-4-4 4-4" />
                  <path d="M21 11.8v2a4 4 0 0 1-4 4H4.2" />
                </svg>
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

            <CardHeader className="flex flex-row items-center gap-4 p-4 pb-2 bg-gradient-to-b from-primary/10 to-transparent">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Avatar>
                  <AvatarImage src={mockUser.avatarUrl} alt={displayName} />
                  <AvatarFallback>{avatarInitials}</AvatarFallback>
                </Avatar>
              </motion.div>
              <div className="flex-1">
                <div className="font-medium">{displayName}</div>
                <div className="text-xs text-muted-foreground">{timeDisplay}</div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="cursor-pointer z-10">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setShowReport(true)}
                  >
                    <Flag className="mr-2 h-4 w-4" />
                    Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="py-2.5 px-5">
              <motion.p
                className="text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {mockPrayer.prayer_request}
              </motion.p>
              {mockPrayer.category && (
                <motion.div
                  className="mt-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-2.5 py-0.5 text-xs font-semibold">
                    {mockPrayer.category}
                  </span>
                </motion.div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between items-center pb-6 pl-4 pr-2.5 border-t border-primary/10">
              <div className="text-sm text-muted-foreground">{14} people praying</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMessage(true)}
                className="relative overflow-hidden group h-8"
              >
                <motion.span
                  className="absolute inset-0 bg-primary/10 rounded-md"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10 flex items-center">
                  <MessageCircle className="mr-1 h-4 w-4" />
                  Send message
                </span>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* Separate action button row */}
      <div className="flex justify-center gap-4 mt-6">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer h-12 w-12 rounded-full border-2 border-destructive text-destructive"
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Skip</span>
          </Button>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Button
            size="icon"
            className="cursor-pointer h-12 w-12 rounded-full bg-primary hover:bg-primary/90 relative overflow-hidden"
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.4 }}
            />
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
                <path d="M3 12.2v-2a4 4 0 0 1 4-4h12.8M7 21.9l-4-4 4-4" />
                <path d="M21 11.8v2a4 4 0 0 1-4 4H4.2" />
              </svg>
            </span>
            <span className="sr-only">Pray</span>
          </Button>
        </motion.div>
      </div>

      <Dialog open={showReport} onOpenChange={setShowReport}>
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
            <Button variant="outline" onClick={() => setShowReport(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowReport(false)}>Submit Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showMessage} onOpenChange={setShowMessage}>
        <DialogContent className="bg-card border-primary/20">
          <DialogHeader>
            <DialogTitle>Send message</DialogTitle>
            <DialogDescription>
              Send a message of encouragement to {displayName}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Write your message of encouragement..."
              className="border-primary/20"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMessage(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowMessage(false)}>
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
