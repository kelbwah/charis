import { motion } from "framer-motion";
import { Edit, MessageCircle, MoreHorizontal, Trash } from "lucide-react";
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
import type { Prayer } from "@/services/types";
import { getPrayerCountById } from "@/services/prayers";
import { useEffect } from "react";
import { formatDistance } from "date-fns";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { PrayerCardSkeleton } from "./prayer-card-skeleton";
import { useStore } from "@/store/useStore";
import { useUIStore } from "@/store/uiStore";

interface PrayerRequestCardProps {
  prayer: Prayer;
  handleDelete: (prayerId: string) => Promise<void>;
}

export function PrayerRequestCard({
  prayer,
  handleDelete,
}: PrayerRequestCardProps) {
  const { loading, setLoading } = useUIStore();
  const { setDeleteDialog, requestCard, setRequestCard } = useStore();

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const prayerCountResponse = await getPrayerCountById(prayer.id);
        setRequestCard({ count: prayerCountResponse.data.WillPrayCount });
      } catch (error) {
        console.error("Failed to fetch prayer count", error);
      }
      setLoading(false);
    };

    fetchCount();
  }, [prayer.id]);

  if (loading) {
    return <PrayerCardSkeleton showButtonActions={false} />;
  } else {
    return (
      <motion.div
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
                  {prayer.prayer_title || "Untitled Prayer"}
                </CardTitle>
                <CardDescription>
                  {formatDistance(new Date(prayer.created_at), new Date(), {
                    addSuffix: true,
                  })}
                </CardDescription>
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
                    onClick={async () => {
                      setDeleteDialog({ open: true, prayer });
                      await handleDelete(prayer.id);
                    }}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="pr-8">
            <p className="line-clamp-3 text-sm">{prayer.prayer_request}</p>
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
              {requestCard.count}{" "}
              {requestCard.count === 1 ? "person" : "people"} praying
            </div>
            <Button variant="ghost" size="sm" className="gap-1">
              <MessageCircle className="h-4 w-4" />
              {0}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }
}
