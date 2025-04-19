"use client";

import { LoadingBarContainer } from "react-top-loading-bar";

export default function TopLoadingBarContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LoadingBarContainer>{children}</LoadingBarContainer>;
}
