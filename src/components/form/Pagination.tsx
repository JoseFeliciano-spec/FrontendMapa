"use client";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPage: (page: number) => void;
}

export function Pagination({ page, pageSize, total, onPage }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (totalPages <= 1) return null;

  // LOGICA DE TRUNCADO (Genera array tipo [1, '...', 4, 5, 6, '...', 20])
  const generatePagination = () => {
    // Si son pocas páginas (<= 7), mostramos todas
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const siblings = 1; // Cuántos números a los lados de la actual
    const leftSibling = Math.max(page - siblings, 1);
    const rightSibling = Math.min(page + siblings, totalPages);

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < totalPages - 1;

    // Caso 1: Solo puntos a la derecha [1, 2, 3, 4, 5, ..., 20]
    if (!showLeftDots && showRightDots) {
      const leftCount = 3 + 2 * siblings;
      const leftRange = Array.from({ length: leftCount }, (_, i) => i + 1);
      return [...leftRange, "...", totalPages];
    }

    // Caso 2: Solo puntos a la izquierda [1, ..., 16, 17, 18, 19, 20]
    if (showLeftDots && !showRightDots) {
      const rightCount = 3 + 2 * siblings;
      const rightRange = Array.from(
        { length: rightCount },
        (_, i) => totalPages - rightCount + i + 1
      );
      return [1, "...", ...rightRange];
    }

    // Caso 3: Puntos a ambos lados [1, ..., 9, 10, 11, ..., 20]
    if (showLeftDots && showRightDots) {
      const middleRange = Array.from(
        { length: rightSibling - leftSibling + 1 },
        (_, i) => leftSibling + i
      );
      return [1, "...", ...middleRange, "...", totalPages];
    }

    return [];
  };

  const pages = generatePagination();

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      {/* Botón ANTERIOR */}
      <button
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="h-11 rounded-lg bg-[#0066FF] px-6 text-sm font-bold text-white transition hover:bg-[#0052CC] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Anterior
      </button>

      {/* Números de página */}
      {pages.map((p, idx) => {
        if (p === "...") {
          return (
            <span
              key={`dots-${idx}`}
              className="flex h-11 w-11 items-center justify-center text-white opacity-50"
            >
              ...
            </span>
          );
        }

        const pageNumber = p as number;
        const isActive = page === pageNumber;

        return (
          <button
            key={pageNumber}
            onClick={() => onPage(pageNumber)}
            className={`h-11 w-11 rounded-lg text-sm font-bold text-white transition ${
              isActive
                ? "bg-[#0066FF] hover:bg-[#0052CC]" // Activo (Sólido)
                : "bg-[#0066FF] opacity-50 hover:opacity-100" // Inactivo (Opaco)
            }`}
          >
            {pageNumber}
          </button>
        );
      })}

      {/* Botón SIGUIENTE */}
      <button
        onClick={() => onPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="h-11 rounded-lg bg-[#0066FF] px-6 text-sm font-bold text-white transition hover:bg-[#0052CC] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Siguiente
      </button>
    </div>
  );
}
