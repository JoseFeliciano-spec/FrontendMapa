// app/airports/[code]/page.tsx
"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { ArrowLeft, Info, MapPin, Clock, BarChart3 } from "lucide-react";
import { useAirportContext } from "@/components/provider/AirportContext";
import { useHistoryStore } from "@/store/useHistoryStore";

const AirportMap = dynamic(
  () => import("@/components/maps/AirportMap").then((m) => m.AirportMap),
  { ssr: false }
);

export default function AirportDetailPage() {
  const router = useRouter();
  const params = useParams();

  // Soporta [code] o [id] sin romperse
  const seg =
    (Array.isArray((params as any)?.code)
      ? (params as any).code[0]
      : (params as any)?.code) ??
    (Array.isArray((params as any)?.id)
      ? (params as any).id[0]
      : (params as any)?.id) ??
    "";
  const codeParam = String(seg || "").toUpperCase();

  const { selectedAirport, setSelectedAirport } = useAirportContext();
  const { items, hydrated } = useHistoryStore();

  // IMPORTANTE: hooks antes de cualquier return condicional
  const [activeTab, setActiveTab] = React.useState<
    "general" | "ubicacion" | "zona" | "estadisticas"
  >("general");

  const setOnceRef = React.useRef(false);

  // Fallback inmediato a localStorage (no espera rehidratación)
  React.useEffect(() => {
    if (setOnceRef.current || selectedAirport || !codeParam) return;
    try {
      const raw = localStorage.getItem("skyconnect-history");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const list = Array.isArray(parsed?.state?.items)
        ? parsed.state.items
        : Array.isArray(parsed?.items)
        ? parsed.items
        : [];
      const found = list.find((it: any) => {
        const byCode = String(it?.code || "").toUpperCase();
        const byAirport = String(
          it?.airport?.icao_code || it?.airport?.iata_code || ""
        ).toUpperCase();
        return byCode === codeParam || byAirport === codeParam;
      })?.airport;
      if (found) {
        setSelectedAirport(found);
        setOnceRef.current = true;
      }
    } catch {
      /* ignore */
    }
  }, [selectedAirport, codeParam, setSelectedAirport]);

  // Segundo intento cuando Zustand ya hidrató
  React.useEffect(() => {
    if (setOnceRef.current || selectedAirport || !codeParam || !hydrated)
      return;
    const hit = items.find(
      (it) => String(it.code).toUpperCase() === codeParam
    )?.airport;
    if (hit) {
      setSelectedAirport(hit);
      setOnceRef.current = true;
    }
  }, [selectedAirport, codeParam, hydrated, items, setSelectedAirport]);

  if (!selectedAirport) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0b1422] text-white">
        <p className="mb-4">No hay datos del aeropuerto en memoria local.</p>
        <button
          onClick={() => router.push("/?view=results")}
          className="rounded-lg bg-sky-500 px-6 py-3 hover:bg-sky-600"
        >
          Ir a la lista
        </button>
      </div>
    );
  }

  const airport = selectedAirport;
  const lat = airport.latitude ? Number(airport.latitude) : null;
  const lng = airport.longitude ? Number(airport.longitude) : null;

  return (
    <main className="min-h-screen bg-[#0b1422] pb-20 text-white">
      <div className="mx-auto max-w-5xl p-6">
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-sm text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>

        <h1 className="mb-2 text-center text-5xl font-black text-sky-500">
          {airport.iata_code || airport.icao_code}
        </h1>
        <p className="mb-10 text-center text-xl text-gray-400">
          {airport.airport_name}
        </p>

        <div className="mb-8 flex overflow-hidden rounded-lg border border-white/10 bg-[#151e2d]">
          {(["general", "ubicacion", "zona", "estadisticas"] as const).map(
            (t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`flex-1 py-4 text-center text-sm font-bold transition ${
                  activeTab === t
                    ? "bg-[#0066FF] text-white"
                    : "text-gray-400 hover:bg-[#1e2a3b] hover:text-white"
                }`}
              >
                {t === "general"
                  ? "General"
                  : t === "ubicacion"
                  ? "Ubicación"
                  : t === "zona"
                  ? "Zona Horaria"
                  : "Estadísticas"}
              </button>
            )
          )}
        </div>

        {activeTab === "general" && (
          <section className="overflow-hidden rounded-xl border border-white/10 bg-[#111823]">
            <div className="p-8">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-sky-400">
                <Info className="h-6 w-6" /> Información General
              </h2>
              <div className="space-y-3">
                <Row label="Código IATA" value={airport.iata_code || "N/A"} />
                <Row label="Código ICAO" value={airport.icao_code || "N/A"} />
                <Row label="País" value={airport.country_name || "N/A"} />
                <Row
                  label="Ciudad IATA"
                  value={airport.city_iata_code || "N/A"}
                />
                <Row
                  label="Teléfono"
                  value={airport.phone_number || "No disponible"}
                />
              </div>
            </div>
          </section>
        )}

        {activeTab === "ubicacion" && (
          <div className="space-y-4">
            <section className="overflow-hidden rounded-xl border border-white/10 bg-[#111823]">
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-6 md:p-8">
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-sky-400">
                    <MapPin className="h-5 w-5" />
                    Ubicación
                  </h2>
                  <dl className="space-y-2 text-sm md:text-base">
                    <Field label="Latitud" value={airport.latitude ?? "N/A"} />
                    <Field
                      label="Longitud"
                      value={airport.longitude ?? "N/A"}
                    />
                    <Field
                      label="ID Geoname"
                      value={airport.geoname_id ?? "N/A"}
                    />
                  </dl>
                </div>
                <div className="relative hidden min-h-[140px] w-full overflow-hidden bg-[#050811] md:block md:w-2/5">
                  <div className="absolute inset-0 bg-gradient-to-l from-[#111823] to-transparent" />
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-xl border border-white/10 bg-[#111823] p-3">
              <div className="h-[360px] w-full overflow-hidden rounded-xl">
                {lat !== null && lng !== null ? (
                  <AirportMap
                    lat={lat}
                    lng={lng}
                    name={airport.airport_name || ""}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    Coordenadas no disponibles.
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === "zona" && (
          <div className="space-y-6">
            <section className="overflow-hidden rounded-xl border border-white/10 bg-[#111823] p-8">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-sky-400">
                <Clock className="h-6 w-6" /> Zona Horaria
              </h2>
              <p>
                <span className="font-bold text-white">Zona Horaria: </span>
                <span className="text-gray-300">
                  {airport.timezone || "N/A"}
                </span>
              </p>
              <p className="mt-1">
                <span className="font-bold text-white">GMT: </span>
                <span className="text-gray-300">{airport.gmt || "N/A"}</span>
              </p>
            </section>

            <section className="overflow-hidden rounded-xl border border-white/10 bg-[#111823] p-8">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-sky-400">
                <Clock className="h-6 w-6" /> Hora Local
              </h2>
              <p className="text-2xl font-mono text-white">
                {new Date().toLocaleTimeString("es-ES", {
                  timeZone: airport.timezone || "UTC",
                })}
              </p>
              <p className="mt-1 text-sm text-gray-400">
                {new Date().toLocaleDateString("es-ES", {
                  timeZone: airport.timezone || "UTC",
                })}
              </p>
            </section>
          </div>
        )}

        {activeTab === "estadisticas" && (
          <section className="overflow-hidden rounded-xl border border-white/10 bg-[#111823] p-12 text-center">
            <BarChart3 className="mx-auto mb-4 h-10 w-10 text-gray-600" />
            <h2 className="mb-2 text-xl font-bold text-white">
              Estadísticas no disponibles
            </h2>
            <p className="text-sm text-gray-400">
              El plan gratuito no incluye datos estadísticos para este
              aeropuerto.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-white/5 pb-2">
      <span className="font-bold text-white">{label}:</span>
      <span className="text-gray-300">{value}</span>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="min-w-[90px] font-bold text-white">{label}:</dt>
      <dd className="text-gray-300">{value}</dd>
    </div>
  );
}
