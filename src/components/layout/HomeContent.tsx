"use client";

import * as React from "react";
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { SearchBar } from "@/components/form/SearchBar";
import { PageSizeSelector } from "@/components/form/PageSize";
import { useAirports } from "@/hooks/useAirports";
import { SearchResultsSkeleton } from "@/components/card/SearchResultsSkeleton";
import { Info } from "lucide-react";
import image from "@/assets/png/image.png";
import { useAirportContext } from "@/components/provider/AirportContext";
import { useHistoryStore } from "@/store/useHistoryStore";

const AirportsList = dynamic(() =>
  import("@/components/form/AirportsList").then((m) => m.AirportsList)
);
const Pagination = dynamic(() =>
  import("@/components/form/Pagination").then((m) => m.Pagination)
);

export function HomeContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setSelectedAirport } = useAirportContext();
  const { addVisit } = useHistoryStore();

  const view = searchParams.get("view");
  const qParam = searchParams.get("q") || "";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const pageSizeParam = parseInt(searchParams.get("limit") || "1000", 10);
  const isCollapsed = view === "results";

  const [query, setQuery] = React.useState(qParam);
  const [page, setPage] = React.useState(pageParam);
  const [pageSize, setPageSize] = React.useState(pageSizeParam);

  React.useEffect(() => {
    setQuery(qParam);
    setPage(pageParam);
    setPageSize(pageSizeParam);
  }, [qParam, pageParam, pageSizeParam]);

  const { data, isFetching } = useAirports("", page, pageSize, {
    enabled: isCollapsed,
    staleTime: 60_000,
  });

  const items = data?.data ?? [];
  const apiTotal = data?.pagination?.total ?? 0;

  const filtered = React.useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((a: any) => {
      const text = [a.airport_name, a.iata_code, a.icao_code, a.country_name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return text.includes(q);
    });
  }, [items, query]);

  const updateURL = React.useCallback(
    (updates: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v === null || v === "") params.delete(k);
        else params.set(k, String(v));
      });
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => {
    if (!isCollapsed) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateURL({ q: query || null });
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, isCollapsed, updateURL]);

  const handleSearchSubmit = (val: string) => {
    setQuery(val);
    if (!isCollapsed) {
      const p = new URLSearchParams();
      p.set("view", "results");
      if (val.trim()) p.set("q", val.trim());
      p.set("page", "1");
      p.set("limit", String(pageSize));
      router.push(`/?${p.toString()}`);
    } else {
      updateURL({ q: val || null });
    }
  };

  const handleSearchChange = (val: string) => {
    setQuery(val);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateURL({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
    updateURL({ limit: newSize, page: 1 });
  };

  const goToHome = () => {
    router.push("/");
  };

  const showSkeleton = isFetching && !data;

  return (
    <main className="min-h-screen bg-[#07111d] text-white">
      {isCollapsed && (
        <header className="sticky top-0 z-20 border-b border-white/5 bg-[#07111d]/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center gap-4 p-4">
            <button
              onClick={goToHome}
              className="hidden cursor-pointer bg-gradient-to-r from-[#006AFF] to-[#00F9FF] bg-clip-text text-xl font-black text-transparent transition hover:opacity-80 sm:block"
            >
              SkyConnect
            </button>
            <div className="ml-auto w-full max-w-xl">
              <SearchBar
                initialQuery={query}
                onSearch={handleSearchSubmit}
                onChangeQuery={handleSearchChange}
                compact
                isLoading={isFetching}
              />
            </div>
          </div>
        </header>
      )}

      {!isCollapsed && (
        <section className="relative flex h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
          <Image
            src={image}
            alt="Airport"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#07111d]/75" />
          <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-12 px-4">
            <h1 className="bg-gradient-to-r from-[#006AFF] to-[#00F9FF] bg-clip-text text-4xl font-black text-transparent sm:text-5xl md:text-7xl leading-tight">
              SkyConnect Explorer
            </h1>
            <div className="w-full max-w-[780px]">
              <SearchBar
                initialQuery=""
                onSearch={handleSearchSubmit}
                onChangeQuery={handleSearchChange}
                compact={false}
                isLoading={false}
              />
            </div>
          </div>
        </section>
      )}

      {isCollapsed && (
        <section className="mx-auto max-w-6xl p-6">
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-sky-500/20 bg-sky-500/10 p-4">
            <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-sky-400" />
            <div className="text-sm text-sky-100">
              <p className="font-bold">
                Paginación servidor + filtro local visual
              </p>
              <p className="mt-1 text-sky-200/80">
                La paginación carga bloques de {pageSize} aeropuertos del
                servidor (página {page} de {Math.ceil(apiTotal / pageSize)}). El
                buscador filtra visualmente los {items.length} items de la
                página actual cargada (mostrando {filtered.length}{" "}
                coincidencias). Aviationstack limita búsqueda por API a planes
                de pago, por eso el filtro es local; en plan Free máximo 100 por
                petición, en Professional+ hasta 1000.
              </p>
            </div>
          </div>

          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <PageSizeSelector
              value={pageSize}
              onChange={handlePageSizeChange}
            />
            <p className="text-sm text-gray-400">
              Total: {apiTotal.toLocaleString()} aeropuertos
            </p>
          </div>

          {showSkeleton ? (
            <SearchResultsSkeleton />
          ) : filtered.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-[#0b1422] p-12 text-center">
              <p className="mb-4 text-lg text-gray-400">
                {query
                  ? `Sin resultados para "${query}" en esta página`
                  : "No hay datos"}
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <button
                  onClick={() => {
                    setPage(1);
                    updateURL({ page: 1 });
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="rounded-lg bg-[#0066FF] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0052CC]"
                >
                  Ir a página 1
                </button>
                {query && (
                  <button
                    onClick={() => {
                      setQuery("");
                      setPage(1);
                      updateURL({ q: null, page: 1 });
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="rounded-lg border border-white/20 bg-transparent px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/5"
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <AirportsList
                items={filtered}
                onCard={(item: any) => {
                  const code = (
                    item?.icao_code ||
                    item?.iata_code ||
                    ""
                  ).toUpperCase();
                  setSelectedAirport(item);
                  addVisit(code, item);
                  router.push(`/${code}`);
                }}
              />
              <Pagination
                page={page}
                pageSize={pageSize}
                total={apiTotal}
                onPage={handlePageChange}
              />
            </>
          )}
        </section>
      )}
    </main>
  );
}
