export function SearchResultsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="relative h-32 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0b1422]"
        >
          {/* Simulación de imagen de fondo */}
          <div className="absolute inset-0 animate-pulse bg-white/5" />
          <div className="relative z-10 flex h-full items-center justify-between p-4">
            <div className="space-y-2">
              {/* Título aeropuerto */}
              <div className="h-4 w-48 animate-pulse rounded bg-white/10" />
              {/* Ciudad, País */}
              <div className="h-3 w-32 animate-pulse rounded bg-white/10" />
            </div>
            {/* Código IATA */}
            <div className="h-8 w-12 animate-pulse rounded bg-sky-500/20" />
          </div>
        </div>
      ))}
    </div>
  );
}
