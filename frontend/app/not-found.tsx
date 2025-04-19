"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const [_, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <main className="flex-1 flex items-center justify-center py-32">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-md mx-auto text-center space-y-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div
            className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
            variants={item}
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <motion.path
                d="M17 3.34a10 10 0 1 1 -14.83 8.17"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              <motion.path
                d="M16 8a5 5 0 1 1 -7.5 4.33"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
              />
            </svg>
          </motion.div>

          <motion.h1
            className="text-7xl font-medium tracking-tight"
            variants={item}
          >
            404
          </motion.h1>

          <motion.div
            className="h-px w-16 bg-primary/30 mx-auto"
            variants={item}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "4rem", opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />

          <motion.h2
            className="text-xl font-medium text-primary"
            variants={item}
          >
            Page Not Found
          </motion.h2>

          <motion.p className="text-muted-foreground px-4" variants={item}>
            Even our most fervent prayers couldn't locate this page. Perhaps
            it's on a spiritual journey of its own.
          </motion.p>

          <motion.div className="pt-2" variants={item}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button asChild className="px-6">
                <Link href="/">
                  <motion.span
                    className="flex items-center"
                    initial={{ gap: "0.25rem" }}
                    whileHover={{ gap: "0.5rem" }}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </motion.span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
