"use client";

import { ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import PreviewPrayerCard from "@/components/preview-prayer-card";
import DonationBanner from "@/components/donation-banner";
import CustomLink from "@/components/custom-link";

export default function Home() {
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

  const featureItem = {
    hidden: { opacity: 0, scale: 0.9 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
  };

  const isComingSoon = process.env.FEATURE_COMING_SOON === "true";

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12 space-y-16">
      <motion.div
        className="space-y-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
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
          Charis
        </motion.h1>

        <motion.p
          className="max-w-[700px] text-muted-foreground md:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Connect with others through prayer. Swipe, pray, and support one
          another on your spiritual journey.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 relative overflow-hidden group"
          >
            <CustomLink isComingSoon={isComingSoon} href="/prayers">
              <span className="relative z-10 flex items-center">
                Start Praying
                <motion.span
                  initial={{ x: 0 }}
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 1.5,
                  }}
                >
                  <ArrowRight className="ml-2 h-4 w-4" />
                </motion.span>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </CustomLink>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="relative overflow-hidden"
          >
            <CustomLink isComingSoon={isComingSoon} href="/submit">
              <span className="relative z-10">Submit Prayer</span>
              <motion.span
                className="absolute inset-0 bg-primary/10"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </CustomLink>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        className="w-full max-w-md mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
      >
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <PreviewPrayerCard />
        </motion.div>
      </motion.div>

      <motion.div
        className="grid gap-8 md:grid-cols-3 w-full max-w-5xl"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={featureItem}>
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 overflow-hidden relative h-full">
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            />
            <CardContent className="flex flex-col items-center text-center p-6 space-y-4 relative z-10">
              <motion.div
                className="rounded-full bg-primary/10 p-3"
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <Heart className="h-6 w-6 text-primary" />
              </motion.div>
              <h3 className="text-xl font-medium">Pray for Others</h3>
              <p className="text-muted-foreground">
                Swipe through prayer requests and offer your support to those in
                need.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={featureItem}>
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 overflow-hidden relative h-full">
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            />
            <CardContent className="flex flex-col items-center text-center p-6 space-y-4 relative z-10">
              <motion.div
                className="rounded-full bg-primary/10 p-3"
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
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={featureItem}>
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 overflow-hidden relative h-full">
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            />
            <CardContent className="flex flex-col items-center text-center p-6 space-y-4 relative z-10">
              <motion.div
                className="rounded-full bg-primary/10 p-3"
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
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </motion.div>
              <h3 className="text-xl font-medium">Stay Connected</h3>
              <p className="text-muted-foreground">
                Receive notifications when someone prays for you or sends a
                message.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Donation Banner */}
      <motion.div
        className="w-full max-w-5xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-50px" }}
      >
        <DonationBanner isFixed={false} />
      </motion.div>

      <motion.div
        className="w-full max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="p-6 bg-primary/5 rounded-lg border border-primary/20">
          <blockquote className="italic text-lg">
            "And whatever you ask in prayer, if you have faith, you will
            recieve."
          </blockquote>
          <p className="mt-2 text-muted-foreground">Matthew 21:22</p>
        </div>
      </motion.div>
    </div>
  );
}
