export type Airport = {
  airport_name: string;
  iata_code: string | null;
  icao_code: string | null;
  country_name: string | null;
  country_iso2: string | null;
  city_iata_code: string | null;
  latitude: string | null;
  longitude: string | null;
  timezone: string | null;
  gmt: string | null;
  phone_number: string | null;
  geoname_id: string | null;
};

export type AirportsResponse = {
  pagination: { limit: number; offset: number; count: number; total: number };
  data: Airport[];
};
