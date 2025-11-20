"use client";
import { useRouter } from "next/navigation";
import { useHistoryStore } from "@/store/useHistoryStore";
import { useAirportContext } from "@/components/provider/AirportContext";

export default function HistoryPage() {
  const router = useRouter();
  const { items, clear } = useHistoryStore();
  const { setSelectedAirport } = useAirportContext();

  const handleOpen = (code: string, airport: any) => {
    setSelectedAirport(airport);
    router.push(`/${code}`);
  };

  return (
    <main className="min-h-screen bg-[#07111d] text-white">
      <section className="mx-auto max-w-6xl p-6">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Historial de aeropuertos</h1>
          {items.length > 0 && (
            <button
              onClick={clear}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
            >
              Limpiar historial
            </button>
          )}
        </header>

        {items.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-[#0b1422] p-8 text-center text-gray-400">
            Aún no has visitado ningún aeropuerto.
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map(({ code, airport, viewedAt }) => (
              <li
                key={code}
                className="flex cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-[#0b1422] px-4 py-3 hover:bg-[#151e2d]"
                onClick={() => handleOpen(code, airport)}
              >
                <div>
                  <p className="text-sm font-semibold text-sky-400">
                    {airport.airport_name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {code} · {airport.country_name}
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(viewedAt).toLocaleString("es-ES")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
