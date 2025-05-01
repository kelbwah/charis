"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Mail,
  Lock,
  Edit,
  Save,
  X,
  ChevronRight,
  LogOut,
  BookOpen,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useCurrentUser } from "@/lib/auth";
import { User } from "@/services/types";
import { ProfileSkeleton } from "@/components/profile-skeleton";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { id, userLoading, user } = useCurrentUser();
  const [currUser, setCurrUser] = useState<User | null>(null); // Used in updating user information.

  const handleSaveProfile = () => {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    }, 1500);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrUser(user!);
  };

  useEffect(() => {
    if (user && !userLoading) {
      console.log("Got an ID!: ", id);
      console.log("I am a current user!", user);
      setCurrUser(user);
    }
  }, [user, userLoading]);

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {!user ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProfileSkeleton />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-1/3">
                  <Card className="sticky top-20">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="relative mb-4">
                          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                            {user?.username.slice(0, 2).toUpperCase()}
                          </div>
                        </div>
                        <h2 className="text-xl font-bold mt-2">
                          @{user?.username}
                        </h2>
                        <p className="text-muted-foreground text-sm mt-1">
                          Member since{" "}
                          {user?.created_at
                            ? new Date(user.created_at).toLocaleString(
                                "default",
                                {
                                  month: "long",
                                  year: "numeric",
                                }
                              )
                            : ""}
                        </p>

                        {!isEditing ? (
                          <Button
                            variant="outline"
                            className="mt-4 w-full cursor-pointer"
                            onClick={() => setIsEditing(true)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Profile
                          </Button>
                        ) : (
                          <div className="flex gap-2 mt-4 w-full">
                            <Button
                              variant="outline"
                              className="w-1/2 cursor-pointer"
                              onClick={handleCancelEdit}
                            >
                              <X className="mr-2 h-4 w-4" />
                              Cancel
                            </Button>
                            <Button
                              className="w-1/2 cursor-pointer"
                              onClick={handleSaveProfile}
                              disabled={isSaving}
                            >
                              {isSaving ? (
                                <span className="flex items-center">
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
                                  Saving...
                                </span>
                              ) : (
                                <>
                                  <Save className="mr-2 h-4 w-4" />
                                  Save
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>

                      <Separator className="my-6" />

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-2 text-primary" />
                            <span className="text-sm">My Prayers</span>
                          </div>
                          <span className="text-sm font-medium">24</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Heart className="h-4 w-4 mr-2 text-primary" />
                            <span className="text-sm">Praying For</span>
                          </div>
                          <span className="text-sm font-medium">36</span>
                        </div>
                      </div>

                      <Separator className="my-6" />

                      <nav className="space-y-4">
                        <Button
                          variant="outline"
                          className="w-full justify-start cursor-pointer"
                          asChild
                        >
                          <a href="/dashboard">
                            <ChevronRight className="mr-2 h-4 w-4" />
                            Dashboard
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-destructive cursor-pointer"
                          asChild
                        >
                          <a href="/auth">
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                          </a>
                        </Button>
                      </nav>
                    </CardContent>
                  </Card>
                </div>

                {/* Main Content */}
                <div className="w-full md:w-2/3">
                  <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                      <TabsTrigger className="cursor-pointer" value="profile">
                        Profile
                      </TabsTrigger>
                      <TabsTrigger className="cursor-pointer" value="account">
                        Account
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile">
                      <Card>
                        <CardHeader>
                          <CardTitle>Profile Information</CardTitle>
                          <CardDescription>
                            Update your profile information visible to other
                            users
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {!isEditing && (
                            <div className="mb-4 p-3 bg-primary/5 border border-primary/10 rounded-md text-sm">
                              <div className="flex items-center gap-2">
                                <Edit className="h-4 w-4 text-primary" />
                                <span>
                                  Click the <strong>Edit Profile</strong> button
                                  to make changes
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                              id="username"
                              value={currUser?.username}
                              onChange={(e) =>
                                setCurrUser({
                                  ...currUser!,
                                  username: e.target.value,
                                })
                              }
                              disabled={!isEditing}
                              className={!isEditing ? "bg-muted/50" : ""}
                            />
                            <p className="text-xs text-muted-foreground">
                              This will be used in your profile URL:
                              charisconnect.com/users/{currUser?.username}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                              id="bio"
                              placeholder="Tell us a little about yourself"
                              className={`min-h-[100px] ${
                                !isEditing ? "bg-muted/50" : ""
                              }`}
                              value={currUser?.biography}
                              onChange={(e) =>
                                setCurrUser({
                                  ...currUser!,
                                  biography: e.target.value,
                                })
                              }
                              disabled={!isEditing}
                            />
                          </div>

                          <motion.div
                            className="p-4 rounded-lg bg-primary/5 border border-primary/10"
                            whileHover={{ scale: 1.01 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 15,
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <BookOpen className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-medium">Username & Bio</h3>
                                <p className="text-sm text-muted-foreground">
                                  Information here is public to others.
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="account">
                      <Card className="mb-6">
                        <CardHeader>
                          <CardTitle>Account Information</CardTitle>
                          <CardDescription>
                            Update your account details and security settings
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {!isEditing && (
                            <div className="mb-4 p-3 bg-primary/5 border border-primary/10 rounded-md text-sm">
                              <div className="flex items-center gap-2">
                                <Edit className="h-4 w-4 text-primary" />
                                <span>
                                  Click the <strong>Edit Profile</strong> button
                                  to make changes
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="flex items-center gap-2">
                              <div className="relative flex-1">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  id="email"
                                  type="email"
                                  className="pl-10"
                                  value={currUser?.email}
                                  onChange={(e) =>
                                    setCurrUser({
                                      ...currUser!,
                                      email: e.target.value,
                                    })
                                  }
                                  disabled={!isEditing}
                                />
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              We'll never share your email with anyone else
                            </p>
                          </div>

                          {isEditing && (
                            <div className="space-y-2">
                              <Label htmlFor="current-password">
                                Current Password
                              </Label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  id="current-password"
                                  type="password"
                                  className="pl-10"
                                  placeholder="••••••••"
                                />
                              </div>
                            </div>
                          )}

                          {isEditing && (
                            <>
                              <div className="space-y-2">
                                <Label htmlFor="new-password">
                                  New Password
                                </Label>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    id="new-password"
                                    type="password"
                                    className="pl-10"
                                    placeholder="••••••••"
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="confirm-password">
                                  Confirm New Password
                                </Label>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    id="confirm-password"
                                    type="password"
                                    className="pl-10"
                                    placeholder="••••••••"
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Password must be at least 8 characters long
                                </p>
                              </div>
                            </>
                          )}

                          <motion.div
                            className="p-4 rounded-lg bg-primary/5 border border-primary/10"
                            whileHover={{ scale: 1.01 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 15,
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Lock className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-medium">
                                  Account Security
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  We recommend using a strong, unique password
                                  for your account
                                </p>
                              </div>
                            </div>
                          </motion.div>

                          <Separator className="my-6" />

                          <div className="space-y-4">
                            <h3 className="font-bold text-destructive">
                              Delete Account
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Once you delete your account, there is no going
                              back. Please be certain.
                            </p>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="cursor-pointer"
                            >
                              Delete Account
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
