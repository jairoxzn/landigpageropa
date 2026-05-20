"use client";
import { create } from "zustand";

interface FilterState {
  category?: string;
  sizes: string[];
  priceMin: number;
  priceMax: number;
  search: string;
  sort: "newest" | "price_asc" | "price_desc" | "popular";
  setCategory: (v?: string) => void;
  toggleSize: (s: string) => void;
  setPrice: (min: number, max: number) => void;
  setSearch: (s: string) => void;
  setSort: (s: FilterState["sort"]) => void;
  reset: () => void;
}

export const useFilters = create<FilterState>((set, get) => ({
  category: undefined,
  sizes: [],
  priceMin: 0,
  priceMax: 1000,
  search: "",
  sort: "newest",
  setCategory: (v) => set({ category: v }),
  toggleSize: (s) =>
    set({
      sizes: get().sizes.includes(s)
        ? get().sizes.filter((x) => x !== s)
        : [...get().sizes, s]
    }),
  setPrice: (priceMin, priceMax) => set({ priceMin, priceMax }),
  setSearch: (search) => set({ search }),
  setSort: (sort) => set({ sort }),
  reset: () =>
    set({
      category: undefined,
      sizes: [],
      priceMin: 0,
      priceMax: 1000,
      search: "",
      sort: "newest"
    })
}));
