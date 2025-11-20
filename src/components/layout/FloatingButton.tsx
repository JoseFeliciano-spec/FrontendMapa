"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Home, History, Menu, X } from "lucide-react";

export function FloatingNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const btnRef = React.useRef<HTMLButtonElement | null>(null);

  const isHome =
    pathname === "/" ||
    pathname.startsWith("/?") ||
    pathname.startsWith("/airports"); // resalta Home [web:338]
  const isHistory = pathname.startsWith("/history"); // resalta Historial [web:338]

  // Cerrar con clic fuera
  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]); // manejo accesible básico [web:342]

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  }; // navegación simple y predecible [web:342]

  return (
    <>
      {/* Botón flotante */}
      <button
        ref={btnRef}
        aria-label="Abrir menú"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#111827]/90 text-white shadow-xl ring-1 ring-white/10 backdrop-blur transition hover:bg-[#1f2937]"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Popover controlado */}
      {open && (
        <div
          ref={panelRef}
          role="menu"
          aria-label="Menú principal"
          className="fixed bottom-20 right-6 z-50 w-44 rounded-xl border border-white/10 bg-[#0b1220] p-2 text-white shadow-2xl backdrop-blur-lg"
        >
          <button
            onClick={() => go("/?view=results")}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-white/5 ${
              isHome ? "bg-white/10" : ""
            }`}
          >
            <Home className="h-4 w-4 text-sky-400" />
            Home
          </button>
          <button
            onClick={() => go("/history")}
            className={`mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-white/5 ${
              isHistory ? "bg-white/10" : ""
            }`}
          >
            <History className="h-4 w-4 text-sky-400" />
            Historial
          </button>
        </div>
      )}
    </>
  );
}
