// src/context/AirportContext.tsx
"use client";

import * as React from "react";

type Airport = {
  id?: string;
  gmt?: string;
  iata_code?: string;
  icao_code?: string;
  country_iso2?: string;
  latitude?: string;
  longitude?: string;
  airport_name?: string;
  country_name?: string;
  phone_number?: string | null;
  timezone?: string;
  city_iata_code?: string;
  geoname_id?: string;
};

type AirportContextType = {
  selectedAirport: Airport | null;
  setSelectedAirport: (airport: Airport) => void;
};

const AirportContext = React.createContext<AirportContextType | undefined>(
  undefined
);

export function AirportProvider({ children }: { children: React.ReactNode }) {
  const [selectedAirport, setSelectedAirport] = React.useState<Airport | null>(
    null
  );

  return (
    <AirportContext.Provider value={{ selectedAirport, setSelectedAirport }}>
      {children}
    </AirportContext.Provider>
  );
}

export function useAirportContext() {
  const context = React.useContext(AirportContext);
  if (!context)
    throw new Error("useAirportContext debe usarse dentro de AirportProvider");
  return context;
}
