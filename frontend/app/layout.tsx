import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SonnerProvider } from "@/components/sonner-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ClerkLoaded, ClerkProvider } from "@clerk/nextjs";
import TopLoadingBarContainer from "@/components/top-loading-bar-container";
import TopLoadingBarProvider from "@/components/top-loading-bar-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Charis",
  description:
    "Connect with others through prayer. Share your prayer requests and pray for others.",
};

const isComingSoon = process.env.FEATURE_COMING_SOON === "true";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TopLoadingBarContainer>
      <TopLoadingBarProvider>
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "hsl(36, 60%, 45%)",
            },
          }}
        >
          <html lang="en" suppressHydrationWarning>
            <head>
              <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
            </head>
            <body className={inter.className}>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <ClerkLoaded>
                  <div className="flex min-h-screen flex-col">
                    <Navbar
                      isComingSoon={isComingSoon}
                      showLinks={!isComingSoon}
                    />
                    <main className="flex-1">{children}</main>
                    <Footer
                      isComingSoon={isComingSoon}
                      showLinks={!isComingSoon}
                    />
                  </div>
                </ClerkLoaded>
                <SonnerProvider />
              </ThemeProvider>
            </body>
          </html>
        </ClerkProvider>
      </TopLoadingBarProvider>
    </TopLoadingBarContainer>
  );
}
