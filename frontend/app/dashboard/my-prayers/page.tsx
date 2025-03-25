"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Trash,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { prayers } from "@/lib/data";
import type { Prayer } from "@/lib/types";
import { Separator } from "@/components/ui/separator";

export default function MyPrayersPage() {
  const [myPrayers, setMyPrayers] = useState<Prayer[]>(prayers.slice(0, 3));
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    prayer: Prayer | null;
  }>({
    open: false,
    prayer: null,
  });

  const handleDelete = () => {
    if (deleteDialog.prayer) {
      setMyPrayers(myPrayers.filter((p) => p.id !== deleteDialog.prayer?.id));
      setDeleteDialog({ open: false, prayer: null });
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
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

      {myPrayers.length > 0 ? (
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence>
            {myPrayers.map((prayer) => (
              <motion.div
                key={prayer.id}
                variants={item}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                layout
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="h-full border-primary/20 bg-card/80 backdrop-blur-sm overflow-hidden p-0">
                  <CardHeader className="pt-4 bg-gradient-to-b from-primary/5 to-transparent">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {prayer.title || "Untitled Prayer"}
                        </CardTitle>
                        <CardDescription>{prayer.timeAgo}</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive cursor-pointer font-extrabold"
                            onClick={() =>
                              setDeleteDialog({ open: true, prayer })
                            }
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pr-8">
                    <p className="line-clamp-3 text-sm">{prayer.content}</p>
                    {prayer.category && (
                      <Badge
                        variant="outline"
                        className="mt-6 border-primary/30 bg-primary/5 rounded-lg"
                      >
                        {prayer.category}
                      </Badge>
                    )}
                  </CardContent>
                  <Separator />
                  <CardFooter className="flex justify-between pb-5">
                    <div className="text-sm text-muted-foreground">
                      {prayer.prayerCount}{" "}
                      {prayer.prayerCount === 1 ? "person" : "people"} praying
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {prayer.messages?.length || 0}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
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

      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          !open && setDeleteDialog({ open, prayer: null })
        }
      >
        <DialogContent className="bg-card border-primary/20">
          <DialogHeader>
            <DialogTitle>Delete Prayer Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this prayer request? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, prayer: null })}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
