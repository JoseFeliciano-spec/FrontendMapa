"use client";
import * as React from "react";
import * as yup from "yup";
import { Loader2 } from "lucide-react";

const schema = yup
  .string()
  .transform((v) => (v ?? "").trim())
  .max(50, "Máximo 50 caracteres")
  .test("min-if-not-empty", "Mínimo 2 caracteres", (v) => !v || v.length >= 2);

type Props = {
  onSearch: (q: string) => void;
  onChangeQuery?: (q: string) => void; // ← NUEVO: emite cambios mientras escribes
  initialQuery?: string;
  compact?: boolean;
  isLoading?: boolean;
};

export function SearchBar({
  onSearch,
  onChangeQuery,
  initialQuery = "",
  compact = false,
  isLoading = false,
}: Props) {
  const [value, setValue] = React.useState(initialQuery);
  const [error, setError] = React.useState("");

  // Sincroniza cuando cambia initialQuery (por cambios en la URL)
  React.useEffect(() => {
    setValue(initialQuery ?? "");
  }, [initialQuery]);

  const submit = async () => {
    if (isLoading) return;
    const ok = await schema
      .validate(value)
      .then(() => true)
      .catch((e) => (setError(e.message), false));
    if (!ok) return;
    setError("");
    onSearch((value ?? "").trim());
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setValue(next);
    onChangeQuery?.(next); // ← notifica a Home; Home hace debounce y actualiza ?q=
  };

  return (
    <div
      className={`flex w-full items-center ${
        compact ? "flex-row gap-2" : "flex-col gap-6"
      }`}
    >
      <div className="relative w-full">
        <input
          value={value}
          onChange={onChange}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), submit())}
          placeholder="Buscar aeropuertos…"
          aria-label="Buscar"
          className={`w-full rounded-full border border-white/20 bg-white text-[#0b1422] placeholder:text-slate-400 outline-none shadow-lg transition focus:ring-2 focus:ring-[#006AFF]/50 ${
            compact ? "h-10 px-4 text-sm" : "h-[58px] px-6 text-lg"
          }`}
        />
        {error && !compact && (
          <span className="absolute -bottom-6 left-4 text-xs text-red-300">
            {error}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={submit}
        disabled={isLoading}
        className={`rounded-full bg-gradient-to-r from-[#006AFF] to-[#00F9FF] font-bold text-white shadow-lg transition hover:shadow-xl active:scale-95 disabled:opacity-70 ${
          compact
            ? "h-10 px-4 text-sm min-w-[80px]"
            : "h-[52px] w-[234px] px-6 text-base hover:scale-105"
        } flex items-center justify-center gap-2`}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buscar"}
      </button>
    </div>
  );
}
