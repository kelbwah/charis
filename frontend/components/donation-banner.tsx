"use client";

import { motion } from "framer-motion";
import { Heart, Coffee, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomLink from "./custom-link";
import { useStore } from "@/store/useStore";

interface DonationBannerProps {
  isFixed: boolean;
}

export default function DonationBanner({ isFixed }: DonationBannerProps) {
  const { bannerDismissed, setBannerDismissed } = useStore();

  if (bannerDismissed) {
    return null;
  }

  const isComingSoon = process.env.FEATURE_COMING_SOON === "true";

  if (isFixed) {
    return (
      <motion.div
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-auto overflow-hidden rounded-lg border border-primary/30 shadow-lg bg-primary text-primary-foreground dark:bg-primary/90"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 p-3 pr-10">
          {" "}
          {/* Added right padding to make room for dismiss button */}
          <div className="flex-shrink-0">
            <motion.div
              className="rounded-full p-2 bg-primary-foreground/20 text-primary-foreground"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Coffee className="h-4 w-4" />
            </motion.div>
          </div>
          <div className="flex-1 text-xs sm:text-sm">
            <p className="font-medium">
              Support Charis - Help us keep this prayer community free for
              everyone
            </p>
          </div>
          <div className="flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                asChild
                size="sm"
                variant="secondary"
                className="text-xs h-8"
              >
                <CustomLink isComingSoon={isComingSoon} href="/donate">
                  <Heart className="mr-1 h-3 w-3" />
                  Support
                </CustomLink>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Moved the dismiss button outside the flex container */}
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full text-primary-foreground opacity-80 transition-opacity hover:opacity-100"
          onClick={() => setBannerDismissed(true)}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </motion.div>
    );
  }

  // Original full banner for non-fixed position
  return (
    <motion.div
      className="overflow-hidden rounded-lg border relative border-primary/20 bg-card dark:bg-card/80 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Button
        variant="ghost"
        size="icon"
        className="cursor-pointer absolute right-2 top-2 h-8 w-8 rounded-full transition-opacity hover:opacity-100 opacity-70"
        onClick={() => setBannerDismissed(true)}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Dismiss</span>
      </Button>

      <div className="flex flex-col md:flex-row items-center gap-6 p-6">
        <div className="flex-shrink-0 flex items-center justify-center">
          <motion.div
            className="rounded-full p-4 bg-primary/10 text-primary dark:bg-primary/20"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Coffee className="h-8 w-8" />
          </motion.div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-medium mb-2">Support Charis</h3>
          <p className="mb-0 md:mb-2 text-muted-foreground">
            Charis is supported by generous people like you. Your donation helps
            us maintain this prayer community and keep it free for everyone.
          </p>
        </div>

        <div className="flex-shrink-0 mt-4 md:mt-0">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button asChild className="relative overflow-hidden group">
              <CustomLink isComingSoon={isComingSoon} href="/donate">
                <span className="relative z-10 flex items-center">
                  <Heart className="mr-2 h-4 w-4" />
                  Support Us
                </span>
                <span className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </CustomLink>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
