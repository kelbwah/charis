"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Heart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createInitialLaunchEmailsEntry } from "@/services/initial-launch-emails";

export default function ComingSoonPage() {
  const [targetDate] = useState(() => {
    const baseDate = new Date("2025-05-01");
    const twoWeeksLater = new Date(baseDate);
    twoWeeksLater.setDate(baseDate.getDate() + 14);
    return twoWeeksLater;
  });

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Update countdown timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      setIsSubmitting(true);
      await createInitialLaunchEmailsEntry(email);
      setIsSubscribed(true);
      toast.success("Thank you for subscribing!", {
        description: "We'll notify you when Charis launches.",
      });
    } catch (error) {
      setIsSubmitting(false);
      setIsSubscribed(false);
      toast.error("Error while subscribing", {
        description: "Please try again later.",
      });
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <motion.div
        className="max-w-3xl w-full space-y-16 text-center relative z-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Logo and Title */}
        <motion.div className="space-y-6" variants={item}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
            className="mx-auto mb-6 relative w-24 h-24"
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

          <motion.h1
            className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Charis is Coming Soon
          </motion.h1>

          <motion.p
            className="max-w-[700px] mx-auto text-muted-foreground md:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Connect with others through prayer. Swipe, pray, and support one
            another on your spiritual journey.
          </motion.p>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div variants={item} className="space-y-8">
          <h2 className="text-2xl font-semibold">Launching In</h2>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            {[
              { label: "Days", value: timeLeft.days },
              { label: "Hours", value: timeLeft.hours },
              { label: "Minutes", value: timeLeft.minutes },
              { label: "Seconds", value: timeLeft.seconds },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              >
                <motion.div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-card border border-primary/20 flex items-center justify-center shadow-lg relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-primary/5"
                    animate={{
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  />
                  <span className="text-3xl sm:text-4xl font-bold relative z-10">
                    {item.value}
                  </span>
                </motion.div>
                <span className="mt-2 text-sm text-muted-foreground">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Preview */}
        <motion.div variants={item} className="space-y-8">
          <h2 className="text-2xl font-semibold">What to Expect</h2>

          <div className="grid gap-6 md:grid-cols-3">
            <motion.div
              className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg p-6 relative overflow-hidden"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              />
              <div className="relative z-10 space-y-4 flex flex-col items-center justify-center">
                <motion.div
                  className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <Heart className="h-6 w-6 text-primary" />
                </motion.div>
                <h3 className="text-xl font-medium">Pray for Others</h3>
                <p className="text-muted-foreground">
                  Swipe through prayer requests and offer your support to those
                  in need.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg p-6 relative overflow-hidden"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              />
              <div className="relative z-10 space-y-4 flex flex-col items-center justify-center">
                <motion.div
                  className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center"
                  whileHover={{ rotate: -10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
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
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M17 6.1H3" />
                    <path d="M21 12.1H3" />
                    <path d="M15.1 18H3" />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-medium">Share Your Needs</h3>
                <p className="text-muted-foreground">
                  Submit your own prayer requests and receive support from the
                  community.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg p-6 relative overflow-hidden"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              />
              <div className="relative z-10 space-y-4 flex flex-col items-center justify-center">
                <motion.div
                  className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
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
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                    <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-medium">Connect</h3>
                <p className="text-muted-foreground">
                  Send messages of encouragement to those you're praying for.
                  Build a community of support.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Notification Form */}
        <motion.div variants={item} className="max-w-md mx-auto space-y-6">
          <h2 className="text-2xl font-semibold">
            Get Notified When We Launch
          </h2>

          <AnimatePresence mode="wait">
            {!isSubscribed ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="border-primary/20"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button
                    className="cursor-pointer"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-1">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Subscribing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4 mr-1" />
                        Notify Me
                      </span>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  We'll never share your email with anyone else. You can
                  unsubscribe at any time.
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center gap-3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="rounded-full bg-primary/20 p-1">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm">
                  Thank you for subscribing! We'll notify you when Charis
                  launches.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Scripture Quote */}
        <motion.div className="max-w-2xl mx-auto" variants={item}>
          <motion.div
            className="p-6 bg-primary/5 rounded-lg border border-primary/20"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <blockquote className="italic text-lg">
              "And pray in the Spirit on all occasions with all kinds of prayers
              and requests. With this in mind, be alert and always keep on
              praying for all the Lord's people."
            </blockquote>
            <p className="mt-2 text-muted-foreground">Ephesians 6:18</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
