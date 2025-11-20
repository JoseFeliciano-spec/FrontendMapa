import * as React from "react";
import type { Airport } from "../card/AirportCard";
import { AirportCard } from "../card/AirportCard";

export function AirportsList({
  items,
  isLoading = false,
  skeleton = 6,
  onCard,
}: {
  items: Airport[];
  isLoading?: boolean;
  skeleton?: number;
  onCard?: (a: Airport) => void;
}) {
  const data = isLoading
    ? Array.from({ length: skeleton }).map(() => null)
    : items;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {data.map((a, i) =>
        a ? (
          <AirportCard
            key={`${a.iata_code}-${a.icao_code}-${i}`}
            a={a}
            onClick={() => onCard?.(a)}
          />
        ) : (
          <div
            key={`sk-${i}`}
            className="h-40 animate-pulse rounded-xl bg-white/5"
          />
        )
      )}
    </div>
  );
}
