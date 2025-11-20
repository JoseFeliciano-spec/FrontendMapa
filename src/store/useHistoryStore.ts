"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Airport = any;

type HistoryItem = {
  code: string;
  airport: Airport;
  viewedAt: string;
};

type HistoryState = {
  items: HistoryItem[];
  hydrated: boolean;
  addVisit: (code: string, airport: Airport) => void;
  clear: () => void;
  setHydrated: (v: boolean) => void;
};

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      addVisit: (code, airport) => {
        if (!code) return;
        const upper = String(code).toUpperCase();
        const rest = get().items.filter((i) => i.code !== upper);
        set({
          items: [
            { code: upper, airport, viewedAt: new Date().toISOString() },
            ...rest,
          ].slice(0, 50),
        });
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: "skyconnect-history",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
