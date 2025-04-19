"use client";

import { RedirectToSignIn, SignedOut, SignedIn } from "@clerk/nextjs";
import { ClerkLoaded } from "@clerk/nextjs";

interface VerifiedClerkSessionProps {
  children: React.ReactNode,
}

export default function VerifiedClerkSession({children}: VerifiedClerkSessionProps) {
  return (
    <ClerkLoaded>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        {children}
      </SignedIn>
    </ClerkLoaded>
  )
};