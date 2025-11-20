import {
  useQuery,
  type UseQueryOptions,
  type QueryKey,
} from "@tanstack/react-query";
import type { AirportsResponse } from "@/types/airport";

type AirportsQueryOptions = Omit<
  UseQueryOptions<AirportsResponse, Error, AirportsResponse, QueryKey>,
  "queryKey" | "queryFn"
>;

export function useAirports(
  q: string,
  page: number,
  pageSize: number,
  options?: AirportsQueryOptions
) {
  const offset = Math.max(0, (page - 1) * pageSize);
  return useQuery<AirportsResponse, Error>({
    queryKey: ["airports", q, page, pageSize],
    queryFn: async () => {
      const sp = new URLSearchParams({
        limit: String(pageSize),
        offset: String(offset),
      });
      if (q.trim()) sp.set("q", q.trim());
      const res = await fetch(`/api/airports?${sp.toString()}`);
      if (!res.ok) throw new Error("Error fetching airports");
      return res.json();
    },
    ...options,
  });
}
