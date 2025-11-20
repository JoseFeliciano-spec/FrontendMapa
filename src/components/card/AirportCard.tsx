// src/components/AirportCard.tsx
import * as React from "react";
import Image from "next/image";
import { Plane } from "lucide-react";
import fly from "@/assets/jpg/fly.jpg";
export type Airport = {
  airport_name: string | null;
  iata_code: string | null;
  icao_code: string | null;
  country_name: string | null;
  city_iata_code: string | null;
};

export function AirportCard({
  a,
  onClick,
}: {
  a: Airport;
  onClick?: () => void;
}) {
  const code = a.iata_code || a.icao_code || "—";
  return (
    <article
      onClick={onClick}
      className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0b1422] p-0 shadow-md transition hover:shadow-lg"
    >
      <div className="absolute inset-0">
        <Image
          src={fly}
          alt=""
          fill
          className="object-cover opacity-30"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      </div>

      <div className="relative grid grid-cols-[1fr,120px] gap-4 p-4">
        <div>
          <p className="text-xs text-sky-200/80">Aeropuerto Internacional</p>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-white">
            {a.airport_name || "—"}
          </h3>
          <p className="mt-1 text-xs text-sky-100/80">
            {a.city_iata_code || "—"}, {a.country_name || "—"}
          </p>
        </div>

        <div className="flex items-center justify-end">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/90 text-white">
            <Plane className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="relative px-4 pb-4">
        <span className="text-3xl font-extrabold tracking-wide text-sky-300">
          {code}
        </span>
      </div>
    </article>
  );
}
