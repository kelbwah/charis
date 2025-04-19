"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLoadingBar } from "react-top-loading-bar";
import React from "react";

interface CustomLinkProps extends React.ComponentProps<typeof Link> {
  href: string;
  isComingSoon: boolean;
  children: React.ReactNode;
}

export default function CustomLink({
  href,
  isComingSoon,
  children,
  ...props
}: CustomLinkProps) {
  const { start, complete } = useLoadingBar({ color: "#b8842c", height: 3 });
  const pathname = usePathname();

  const handleClick = () => {
    if (href === pathname) {
      start();
      complete();
    } else {
      start();
    }
  };

  if (isComingSoon === true) {
    return null;
  }

  return (
    <Link {...props} href={href} onClick={handleClick}>
      {children}
    </Link>
  );
}
