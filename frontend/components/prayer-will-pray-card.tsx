"use client";

import { motion } from "framer-motion";
import { Check, MessageCircle, MoreHorizontal, X } from "lucide-react";
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
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { formatDistance } from "date-fns";
import type { Prayer, User } from "@/services/types";
import { useAuth } from "@clerk/nextjs";
import { getPrayerCountById } from "@/services/prayers";
import { PrayerCardSkeleton } from "./prayer-card-skeleton";
import { SendMessageDialog } from "./send-message-dialog";
import { getUserById } from "@/services/users";

interface PrayerWillPrayCardProps {
  prayer: Prayer;
  handlePrayerRequestAction: (
    prayerId: string,
    status: string
  ) => Promise<void>;
}

export function PrayerWillPrayCard({
  prayer,
  handlePrayerRequestAction,
}: PrayerWillPrayCardProps) {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState<string>("");
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [peoplePraying, setPeoplePraying] = useState<number | null>(null);

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  useEffect(() => {
    const fetchCount = async () => {
      const token = await getToken();
      setLoading(true);
      try {
        const prayerCountResponse = await getPrayerCountById(prayer.id);
        setPeoplePraying(prayerCountResponse.data.WillPrayCount);
      } catch (error) {
        console.error("Failed to fetch prayer count", error);
      }
      setLoading(false);
    };
    fetchCount();

    const getUserInfo = async () => {
      setLoading(true);
      if (!prayer) {
        console.warn("Missing user_id in prayer: ", prayer);
        return;
      }
      const token = await getToken();
      try {
        let userResponse = await getUserById(prayer.user_id);
        if (!prayer.is_anonymous) {
          setDisplayName(userResponse.data.username);
        } else {
          setDisplayName("Anonymous");
        }

        let prayerCountResponse = await getPrayerCountById(prayer.id);
        setPeoplePraying(prayerCountResponse.data.WillPrayCount);
      } catch (error) {
        console.error("Failed to fetch user associated with prayer", error);
      }

      false;
    };
    getUserInfo();
  }, [prayer.id, prayer.user_id]);

  if (loading) {
    return <PrayerCardSkeleton showButtonActions={false} />;
  }

  return (
    <motion.div
      key={prayer.id}
      variants={item}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
      layout
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="h-full border-primary/20 bg-card/80 backdrop-blur-sm overflow-hidden p-0">
        <CardHeader className="pt-4 bg-gradient-to-b from-primary/5 to-transparent">
          <h1></h1>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{prayer.prayer_title}</CardTitle>
              <CardDescription>
                {formatDistance(new Date(prayer.created_at), new Date(), {
                  addSuffix: true,
                })}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="cursor-pointer">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={async () =>
                    await handlePrayerRequestAction(prayer.id, "prayed_for")
                  }
                >
                  <Check className="mr-2 h-4 w-4" />
                  Mark as Prayed
                </DropdownMenuItem>
                <Separator className="my-2" />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={async () =>
                    await handlePrayerRequestAction(prayer.id, "not_now")
                  }
                >
                  <X className="mr-2 h-4 w-4" />
                  <p className="font-bold text-red-500">Uncommit</p>
                </DropdownMenuItem>
                <Separator className="my-2" />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setShowMessage(true)}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Message
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pr-8">
          <p className="line-clamp-3 text-sm">{prayer.prayer_request}</p>
          <div className="py-4 pb-2">
            <Badge
              variant="outline"
              className="mt-3 border-primary/30 bg-primary/5"
            >
              {prayer.category}
            </Badge>
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="flex justify-between pb-5">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 cursor-pointer"
              onClick={() => setShowMessage(true)}
            >
              <MessageCircle className="h-4 w-4" />
              Message
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 cursor-pointer"
              onClick={async () =>
                await handlePrayerRequestAction(prayer.id, "prayed_for")
              }
            >
              <Check className="h-4 w-4" />
              Mark as Prayed
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
      <SendMessageDialog
        displayName={displayName}
        showMessage={showMessage}
        setShowMessage={setShowMessage}
      />
    </motion.div>
  );
}
