"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Calendar,
  BookOpen,
  Heart,
  MessageSquare,
  UserPlus,
  UserCheck,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useParams } from "next/navigation";

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: "Sarah Johnson",
    username: username,
    bio: "Prayer warrior and community builder. I believe in the power of prayer to transform lives and bring people together.",
    location: "Seattle, WA",
    joinedDate: "March 2023",
    favoriteVerse:
      "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight. - Proverbs 3:5-6",
    prayerCount: 42,
    prayingForCount: 78,
    avatarUrl: "/placeholder.svg?height=96&width=96",
  });

  useEffect(() => {
    // Simulate API call to fetch user data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [username]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);

    if (!isFollowing) {
      toast.success(`You are now following ${userData.name}`);
    } else {
      toast.success(`You have unfollowed ${userData.name}`);
    }
  };

  const handleMessage = () => {
    toast.success(`Message feature coming soon!`);
  };

  const handleShare = () => {
    // Copy profile URL to clipboard
    navigator.clipboard.writeText(
      `https://charisconnect.com/users/${username}`
    );
    toast.success("Profile link copied to clipboard");
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="animate-pulse space-y-8 w-full">
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-primary/10 h-24 w-24 mb-4"></div>
                <div className="h-6 bg-primary/10 rounded w-48 mb-2"></div>
                <div className="h-4 bg-primary/10 rounded w-32"></div>
              </div>

              <div className="w-full h-32 bg-primary/10 rounded-lg"></div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-40 bg-primary/10 rounded-lg"></div>
                <div className="h-40 bg-primary/10 rounded-lg"></div>
                <div className="h-40 bg-primary/10 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <Avatar className="h-24 w-24 border-4 border-background mb-4">
              <AvatarImage
                src={userData.avatarUrl || "/placeholder.svg"}
                alt={userData.name}
              />
              <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <h1 className="text-2xl font-bold">{userData.name}</h1>
            <p className="text-muted-foreground">@{userData.username}</p>

            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              <span>Joined {userData.joinedDate}</span>
              {userData.location && (
                <>
                  <span className="mx-2">•</span>
                  <span>{userData.location}</span>
                </>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                variant={isFollowing ? "secondary" : "default"}
                onClick={handleFollow}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Follow
                  </>
                )}
              </Button>

              <Button variant="outline" onClick={handleMessage}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
              </Button>

              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share profile</span>
              </Button>
            </div>
          </div>

          {/* Bio Card */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <p className="text-center">{userData.bio}</p>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="text-2xl font-bold">{userData.prayerCount}</h3>
                <p className="text-sm text-muted-foreground">Prayer Requests</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="text-2xl font-bold">
                  {userData.prayingForCount}
                </h3>
                <p className="text-sm text-muted-foreground">Praying For</p>
              </CardContent>
            </Card>

            <Card className="col-span-2 md:col-span-1">
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-2">
                  <Badge
                    variant="outline"
                    className="bg-primary/5 border-primary/20"
                  >
                    Prayer Warrior
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Active Community Member
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs Content */}
          <Tabs defaultValue="prayers" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="prayers">Prayer Requests</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>

            <TabsContent value="prayers">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Prayer Requests</CardTitle>
                  <CardDescription>
                    Prayer requests shared by {userData.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i}>
                        <CardContent className="pt-6">
                          <h3 className="font-medium mb-2">
                            {
                              [
                                "Health Concerns",
                                "Family Guidance",
                                "Wisdom for Decision",
                              ][i - 1]
                            }
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {
                              [
                                "Please pray for my upcoming medical procedure next week. I'm feeling anxious and could use prayers for peace and healing.",
                                "My son is going through a difficult time at school. Please pray for wisdom for us as parents and for him to find good friends.",
                                "I'm facing an important career decision. Please pray for clarity and wisdom as I consider my options.",
                              ][i - 1]
                            }
                          </p>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>
                              {
                                ["2 days ago", "1 week ago", "2 weeks ago"][
                                  i - 1
                                ]
                              }
                            </span>
                            <span>{[24, 18, 32][i - 1]} people praying</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>About {userData.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {userData.favoriteVerse && (
                    <div className="space-y-2">
                      <h3 className="font-medium">Favorite Bible Verse</h3>
                      <div className="bg-primary/5 rounded-md p-4 border border-primary/10">
                        <p className="italic text-sm">
                          {userData.favoriteVerse}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h3 className="font-medium">Prayer Focus</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Health</Badge>
                      <Badge variant="secondary">Family</Badge>
                      <Badge variant="secondary">Guidance</Badge>
                      <Badge variant="secondary">Community</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="font-medium">Contact Information</h3>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Contact via Charis messaging</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
