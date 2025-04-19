"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useLoadingBar } from "react-top-loading-bar";

export default function TopLoadingBarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the current path.
  const pathname = usePathname();
  const { complete } = useLoadingBar({
    color: "#b8842c",
    height: 3,
  });
  const prevPathname = useRef(pathname);
  const isComingSoon = process.env.FEATURE_COMING_SOON === "true";

  useEffect(() => {
    if (prevPathname.current !== pathname || isComingSoon) {
      // When the pathname changes, complete the loading bar.
      complete();
    }
    prevPathname.current = pathname;
  }, [pathname, complete]);

  return <>{children}</>;
}
