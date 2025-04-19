"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Heart, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import VerifiedClerkSession from "@/components/verified-clerk-session";
import {
  getPrayerResponsesByUser,
  updatePrayerResponse,
} from "@/services/prayers";
import { useAuth } from "@clerk/nextjs";
import { Prayer } from "@/services/types";
import { PrayerWillPrayCard } from "@/components/prayer-will-pray-card";
import { PrayerCardSkeleton } from "@/components/prayer-card-skeleton";

export default function PrayingForPage() {
  const [prayingFor, setPrayingFor] = useState<Prayer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    const loadPrayers = async () => {
      const token = await getToken();
      try {
        setIsLoading(true);
        const response = await getPrayerResponsesByUser(token);
        setPrayingFor(response.data);
      } catch (error) {
        console.error("Failed to load prayer responses:", error);
        toast.error("Failed to load your prayer commitments");
      }
      setIsLoading(false);
    };
    loadPrayers();
  }, [getToken]);

  const handlePrayerRequestAction = async (
    prayerId: string,
    status: string
  ) => {
    const token = await getToken();
    try {
      await updatePrayerResponse(prayerId, status, token);
      setPrayingFor((prev) => prev.filter((p) => p.id !== prayerId));
      if (status === "prayed_for") {
        toast.success("Marked as prayed", {
          description: "Thank you for your prayers.",
        });
      } else if (status === "not_now") {
        toast.success("Uncommitted to prayer", {
          description: "Removed prayer from your commited prayers.",
        });
      }
    } catch (error) {
      console.error("Failed to mark prayer as 'prayed for'.:", error);
      toast.error("Failed to mark prayer as 'prayed for'.:");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <VerifiedClerkSession>
      <div className="space-y-6">
        <motion.h2
          className="text-xl font-semibold"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          Prayers I'm Committed To
        </motion.h2>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Render 3 skeleton cards while loading */}
            {[...Array(3)].map((_, i) => (
              <PrayerCardSkeleton key={i} showButtonActions={false} />
            ))}
          </div>
        ) : prayingFor.length > 0 ? (
          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence>
              {prayingFor.map((prayer) => (
                <PrayerWillPrayCard
                  key={prayer.id}
                  prayer={prayer}
                  handlePrayerRequestAction={handlePrayerRequestAction}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            className="text-center p-12 border rounded-lg border-primary/20 bg-card/50 backdrop-blur-sm"
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
              <Heart className="h-8 w-8 text-primary" />
            </motion.div>
            <h3 className="text-xl font-medium mb-2">
              Not praying for anyone yet
            </h3>
            <p className="text-muted-foreground mb-4">
              When you commit to pray for someone, they'll appear here.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild>
                <Link href="/prayers">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Discover Prayer Requests
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </VerifiedClerkSession>
  );
}
