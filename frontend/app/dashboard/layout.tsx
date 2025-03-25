"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { PlusCircle, Heart, BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col">
      <motion.header
        className="border-b border-primary/10 bg-card/50 backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back to Home</span>
              </Link>
            </Button>
            <h1 className="text-xl font-bold tracking-tight">
              Prayer Dashboard
            </h1>
          </div>

          <Button variant="outline" size="default" asChild>
            <Link href="/prayers">
              <PlusCircle className="mr-2 h-4 w-4" />
              Discover Prayers
            </Link>
          </Button>
        </div>

        <div className="container pb-2">
          <nav className="flex space-x-1">
            <Link href="/dashboard/my-prayers" passHref>
              <Button
                variant={
                  pathname === "/dashboard" ||
                  pathname === "/dashboard/my-prayers"
                    ? "default"
                    : "ghost"
                }
                size="default"
                className="relative cursor-pointer py-2"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                My Prayers
                {pathname === "/dashboard" ||
                  (pathname === "/dashboard/my-prayers" && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      layoutId="activeTab"
                    />
                  ))}
              </Button>
            </Link>
            <Link href="/dashboard/praying-for" passHref>
              <Button
                variant={
                  pathname === "/dashboard/praying-for" ? "default" : "ghost"
                }
                size="default"
                className="relative cursor-pointer"
              >
                <Heart className="mr-2 h-4 w-4" />
                Praying For
                {pathname === "/dashboard/praying-for" && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    layoutId="activeTab"
                  />
                )}
              </Button>
            </Link>
          </nav>
        </div>
      </motion.header>

      <motion.main
        className="flex-1 container py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {children}
      </motion.main>
    </div>
  );
}
