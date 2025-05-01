"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deletePrayer, getAllPrayersByUser } from "@/services/prayers";
import { PrayerRequestCard } from "@/components/prayer-request-card";
import { PrayerCardSkeleton } from "@/components/prayer-card-skeleton";
import { useStore } from "@/store/useStore";
import { useUIStore } from "@/store/uiStore";
import { useCurrentUser } from "@/lib/auth";

export default function MyPrayersPage() {
  const { loading, setLoading } = useUIStore();
  const { myPrayers, deleteDialog, setMyPrayers, setDeleteDialog } = useStore();
  const { id, userLoading } = useCurrentUser();
  console.log(id);

  useEffect(() => {
    const loadMyPrayers = async () => {
      try {
        setLoading(true);
        const response = await getAllPrayersByUser();
        setMyPrayers(response.data);
      } catch (error) {
        console.error("Failed to fetch your prayers:", error);
        toast.error("Failed to load your prayers");
      }
      setLoading(false);
    };
    loadMyPrayers();
  }, [setMyPrayers]);

  const handleDelete = async (prayerId: string) => {
    try {
      await deletePrayer(prayerId);
      setMyPrayers(myPrayers.filter((p) => p.id !== prayerId));
      setDeleteDialog({ open: false, prayer: null });
      toast.success("Prayer deleted");
    } catch (err) {
      console.error("Error caught while deleting prayer: ", err);
      setDeleteDialog({ open: false, prayer: deleteDialog.prayer });
      toast.error("Failed to delete prayer.");
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <motion.h2
            className="text-xl font-semibold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            My Prayer Requests
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button asChild size="lg">
              <Link href="/submit">
                <Plus className="mr-2 h-4 w-4" />
                New Prayer Request
              </Link>
            </Button>
          </motion.div>
        </div>
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Show multiple skeletons if loading */}
            {[...Array(4)].map((_, i) => (
              <PrayerCardSkeleton key={i} showButtonActions={false} />
            ))}
          </div>
        ) : myPrayers.length > 0 ? (
          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence>
              {myPrayers.map((prayer, index) => (
                <PrayerRequestCard
                  key={prayer.id || index}
                  handleDelete={handleDelete}
                  prayer={prayer}
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
              <BookOpen className="h-8 w-8 text-primary" />
            </motion.div>
            <h3 className="text-xl font-medium mb-2">No prayer requests yet</h3>
            <p className="text-muted-foreground mb-4">
              Share your prayer needs with the community.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild>
                <Link href="/submit">
                  <Plus className="mr-2 h-4 w-4" />
                  Submit Prayer Request
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
}
