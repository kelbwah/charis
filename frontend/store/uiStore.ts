import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface UIState {
  loading: boolean;
  setLoading: (v: boolean) => void;
}

export const useUIStore = create<UIState>()(
  immer((set) => ({
    loading: false,
    setLoading: (v) =>
      set((s) => {
        s.loading = v;
      }),
  }))
);
