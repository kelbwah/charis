import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Prayer } from "@/services/types";

interface StoreState {
  // Contact
  isContactSubmitting: boolean;
  setContactSubmitting: (v: boolean) => void;

  // Prayers
  myPrayers: Prayer[];
  setMyPrayers: (p: Prayer[]) => void;
  deleteDialog: { open: boolean; prayer: Prayer | null };
  setDeleteDialog: (d: { open: boolean; prayer: Prayer | null }) => void;

  prayingFor: Prayer[];
  setPrayingFor: (p: Prayer[]) => void;

  // Discover
  activePrayers: Prayer[];
  setActivePrayers: (p: Prayer[]) => void;
  currentIndex: number;
  setCurrentIndex: (i: number) => void;
  prayedFor: string[];
  addPrayedFor: (id: string) => void;
  skipped: string[];
  addSkipped: (id: string) => void;
  exitDirection: "left" | "right" | null;
  setExitDirection: (d: "left" | "right" | null) => void;
  isExiting: boolean;
  setIsExiting: (v: boolean) => void;
  selectedCategory: string | null;
  setSelectedCategory: (c: string | null) => void;
  showAnonymous: boolean;
  setShowAnonymous: (v: boolean) => void;
  sortBy: "newest" | "oldest";
  setSortBy: (s: "newest" | "oldest") => void;
  cursor: string;
  setCursor: (c: string) => void;
  hasMore: boolean;
  setHasMore: (v: boolean) => void;

  // Donate
  selectedAmount: string | null;
  setSelectedAmount: (v: string | null) => void;

  // Submit Prayer
  submit: {
    isSubmitting: boolean;
    title: string;
    request: string;
    category: string;
    scripture: string;
    anonymous: boolean;
  };
  setSubmit: (s: Partial<StoreState["submit"]>) => void;

  // Banner & Navbar
  bannerDismissed: boolean;
  setBannerDismissed: (v: boolean) => void;

  navSheetOpen: boolean;
  setNavSheetOpen: (v: boolean) => void;

  // Prayer Card UI
  prayerCard: {
    showReport: boolean;
    user: any | null;
    count: number | null;
    direction: "left" | "right" | null;
    exitX: number;
  };
  setPrayerCard: (p: Partial<StoreState["prayerCard"]>) => void;

  // Request Card UI
  requestCard: {
    count: number | null;
    loading: boolean;
  };
  setRequestCard: (p: Partial<StoreState["requestCard"]>) => void;

  // Will Pray Card UI
  willPrayCard: {
    loading: boolean;
    displayName: string;
    showMessage: boolean;
    count: number | null;
  };
  setWillPrayCard: (p: Partial<StoreState["willPrayCard"]>) => void;

  // Preview Card UI
  previewCard: {
    showReport: boolean;
    showMessage: boolean;
    dragging: boolean;
    direction: "left" | "right" | null;
    exitX: number;
  };
  setPreviewCard: (p: Partial<StoreState["previewCard"]>) => void;
}

export const useStore = create<StoreState>()(
  immer((set) => ({
    // Contact
    isContactSubmitting: false,
    setContactSubmitting: (v) =>
      set((s) => {
        s.isContactSubmitting = v;
      }),

    // My Prayers
    myPrayers: [],
    setMyPrayers: (p) =>
      set((s) => {
        s.myPrayers = p;
      }),
    deleteDialog: { open: false, prayer: null },
    setDeleteDialog: (d) =>
      set((s) => {
        s.deleteDialog = d;
      }),

    // Praying For
    prayingFor: [],
    setPrayingFor: (p) =>
      set((s) => {
        s.prayingFor = p;
      }),

    // Discover
    activePrayers: [],
    setActivePrayers: (p) =>
      set((s) => {
        s.activePrayers = p;
      }),
    currentIndex: 0,
    setCurrentIndex: (i) =>
      set((s) => {
        s.currentIndex = i;
      }),
    prayedFor: [],
    addPrayedFor: (id) =>
      set((s) => {
        s.prayedFor.push(id);
      }),
    skipped: [],
    addSkipped: (id) =>
      set((s) => {
        s.skipped.push(id);
      }),
    exitDirection: null,
    setExitDirection: (d) =>
      set((s) => {
        s.exitDirection = d;
      }),
    isExiting: false,
    setIsExiting: (v) =>
      set((s) => {
        s.isExiting = v;
      }),
    selectedCategory: null,
    setSelectedCategory: (c) =>
      set((s) => {
        s.selectedCategory = c;
      }),
    showAnonymous: true,
    setShowAnonymous: (v) =>
      set((s) => {
        s.showAnonymous = v;
      }),
    sortBy: "newest",
    setSortBy: (s2) =>
      set((s) => {
        s.sortBy = s2;
      }),
    cursor: "",
    setCursor: (c) =>
      set((s) => {
        s.cursor = c;
      }),
    hasMore: true,
    setHasMore: (v) =>
      set((s) => {
        s.hasMore = v;
      }),

    // Donate
    selectedAmount: null,
    setSelectedAmount: (v) =>
      set((s) => {
        s.selectedAmount = v;
      }),

    // Submit Prayer
    submit: {
      isSubmitting: false,
      title: "",
      request: "",
      category: "",
      scripture: "",
      anonymous: false,
    },
    setSubmit: (partial) =>
      set((s) => {
        Object.assign(s.submit, partial);
      }),

    // Banner & Navbar
    bannerDismissed: false,
    setBannerDismissed: (v) =>
      set((s) => {
        s.bannerDismissed = v;
      }),
    navSheetOpen: false,
    setNavSheetOpen: (v) =>
      set((s) => {
        s.navSheetOpen = v;
      }),

    // Prayer Card UI
    prayerCard: {
      showReport: false,
      user: null,
      count: null,
      direction: null,
      exitX: 0,
    },
    setPrayerCard: (p) =>
      set((s) => {
        Object.assign(s.prayerCard, p);
      }),

    // Request Card UI
    requestCard: { count: null, loading: true },
    setRequestCard: (p) =>
      set((s) => {
        Object.assign(s.requestCard, p);
      }),

    // Will Pray Card UI
    willPrayCard: {
      loading: true,
      displayName: "",
      showMessage: false,
      count: null,
    },
    setWillPrayCard: (p) =>
      set((s) => {
        Object.assign(s.willPrayCard, p);
      }),

    // Preview Card UI
    previewCard: {
      showReport: false,
      showMessage: false,
      dragging: false,
      direction: null,
      exitX: 0,
    },
    setPreviewCard: (p) =>
      set((s) => {
        Object.assign(s.previewCard, p);
      }),
  }))
);
