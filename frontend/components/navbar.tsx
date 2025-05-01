"use client";

import { usePathname } from "next/navigation";
import {
  Menu,
  Home,
  BookOpen,
  PlusCircle,
  LogIn,
  LogOut,
  Mail,
  Send,
  Store,
  User,
  LockKeyhole,
  ShieldPlus,
  ScrollText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import CustomLink from "./custom-link";
import { useStore } from "@/store/useStore";
import { useCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { toast } from "sonner";
import { logout } from "@/services/auth";
import { useRouter } from "next/navigation";
import { UserDropdown } from "./user-dropdown";
import { useEffect } from "react";

interface NavbarProps {
  showLinks: boolean;
  isComingSoon: boolean;
}

export default function Navbar(Props: NavbarProps) {
  const pathname = usePathname();
  const { navSheetOpen, setNavSheetOpen } = useStore();
  const { showLinks = true, isComingSoon } = Props;
  const { id, userLoading, user } = useCurrentUser();
  const signedIn = user ? true : false; // temporary logic
  const signedOut = user ? false : true; // temporary logic
  const router = useRouter();

  console.log(signedIn);

  const mainNavigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Discover", href: "/prayers", icon: PlusCircle },
    { name: "Dashboard", href: "/dashboard", icon: BookOpen },
    { name: "Submit Prayer", href: "/submit", icon: Send },
  ];

  const secondaryNavigation = [
    { name: "Ads", href: "/ads", icon: ShieldPlus },
    { name: "Contact", href: "/contact", icon: Mail },
    { name: "About", href: "/about", icon: Store },
    { name: "Privacy", href: "/privacy", icon: LockKeyhole },
    { name: "Terms", href: "/terms", icon: ScrollText },
  ];

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success("Successfully logged out!");
      router.push("/auth");
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  useEffect(() => {}, [signedIn, signedOut]);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-primary/10">
      <nav className="container flex items-center justify-between py-3">
        <div className="flex items-center gap-6">
          <CustomLink
            isComingSoon={isComingSoon}
            href="/"
            className="flex items-center gap-2"
          >
            <motion.div
              whileHover={{ rotate: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
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
                <path d="M17 3.34a10 10 0 1 1 -14.83 8.17" />
                <path d="M16 8a5 5 0 1 1 -7.5 4.33" />
              </svg>
            </motion.div>
            <span className="text-xl font-bold">Charis</span>
          </CustomLink>

          <div className="hidden lg:flex md:gap-x-6">
            {mainNavigation.map((item) => (
              <CustomLink
                isComingSoon={isComingSoon}
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5 ${
                  pathname === item.href ||
                  (item.href === "/dashboard" &&
                    pathname.startsWith("/dashboard"))
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </CustomLink>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />

          {!isComingSoon && (
            <>
              <div className="hidden lg:flex items-center">
                {!signedIn ? (
                  <CustomLink href="/auth" isComingSoon={isComingSoon}>
                    <Button size="sm" className="cursor-pointer">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                  </CustomLink>
                ) : (
                  <UserDropdown
                    handleLogout={handleSignOut}
                    username={user ? user.username : ""}
                  />
                )}
              </div>

              <Sheet open={navSheetOpen} onOpenChange={setNavSheetOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button
                    variant="outline"
                    size="icon"
                    className="cursor-pointer h-9 w-9"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="right"
                  className="w-[280px] sm:w-[350px] p-0"
                >
                  <div className="flex flex-col h-full">
                    {/* Top User Section */}
                    {signedIn ? (
                      <div className="bg-primary/5 p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-base truncate">
                              {/* user?.fullName */}
                              full name
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {/* user?.primaryEmailAddress?.emailAddress */}
                              email address
                            </p>
                            <div className="mt-2">
                              <Badge
                                variant="outline"
                                className="bg-primary/10 text-xs"
                              >
                                Prayer Warrior
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-primary/5 p-6 flex flex-col items-center justify-center gap-3">
                        <div className="rounded-full bg-primary/10 p-3">
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
                            <path d="M17 3.34a10 10 0 1 1 -14.83 8.17" />
                            <path d="M16 8a5 5 0 1 1 -7.5 4.33" />
                          </svg>
                        </div>
                        <h3 className="text-center font-medium">
                          Join Our Prayer Community
                        </h3>
                        <p className="text-center text-sm text-muted-foreground mb-2">
                          Sign in to share prayers and connect with others
                        </p>
                        <SheetClose asChild>
                          <CustomLink href="/auth" isComingSoon={isComingSoon}>
                            <Button className="cursor-pointer w-full">
                              <LogIn className="mr-2 h-4 w-4" />
                              Sign In
                            </Button>
                          </CustomLink>
                        </SheetClose>
                      </div>
                    )}

                    {/* Main Navigation */}
                    <div className="flex-1 overflow-auto">
                      <SheetHeader className="px-6 pt-6 pb-2">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          MAIN
                        </h3>
                      </SheetHeader>

                      <div className="px-3">
                        {mainNavigation.map((item) => (
                          <SheetClose asChild key={item.name}>
                            <CustomLink
                              isComingSoon={isComingSoon}
                              href={item.href}
                              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent ${
                                pathname === item.href ||
                                (item.href === "/dashboard" &&
                                  pathname.startsWith("/dashboard"))
                                  ? "bg-primary/10 text-primary"
                                  : "text-foreground"
                              }`}
                              onClick={() => setNavSheetOpen(false)}
                            >
                              <item.icon className="h-5 w-5" />
                              {item.name}
                            </CustomLink>
                          </SheetClose>
                        ))}
                      </div>

                      <Separator className="my-4" />

                      {/* Secondary Navigation */}
                      <div className="px-6 pb-2">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          HELP & SUPPORT
                        </h3>
                      </div>
                      <div className="px-3">
                        {secondaryNavigation.map((item) => (
                          <SheetClose asChild key={item.name}>
                            <CustomLink
                              isComingSoon={isComingSoon}
                              href={item.href}
                              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent ${
                                pathname === item.href
                                  ? "bg-primary/10 text-primary"
                                  : "text-foreground"
                              }`}
                              onClick={() => setNavSheetOpen(false)}
                            >
                              <item.icon className="h-5 w-5" />
                              {item.name}
                            </CustomLink>
                          </SheetClose>
                        ))}
                      </div>

                      {/* Profile Section */}
                      {signedIn && (
                        <>
                          <Separator className="my-4" />
                          <div className="px-6 pb-2">
                            <h3 className="text-sm font-medium text-muted-foreground">
                              PROFILE
                            </h3>
                          </div>
                          <div className="px-3 pb-4">
                            <SheetClose asChild>
                              <Link
                                href="/profile"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent text-foreground"
                                onClick={() => setNavSheetOpen(false)}
                              >
                                <User className="h-5 w-5" />
                                View Profile
                              </Link>
                            </SheetClose>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Footer */}
                    {signedIn ? (
                      <div className="p-6 border-t">
                        <SheetClose asChild>
                          <Button
                            onClick={async () => await handleSignOut()}
                            variant="outline"
                            className="w-full justify-start cursor-pointer"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                          </Button>
                        </SheetClose>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-sm text-muted-foreground border-t">
                        <p>© 2025 Charis. All rights reserved.</p>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
