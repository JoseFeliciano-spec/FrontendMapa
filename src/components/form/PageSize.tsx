"use client";

interface PageSizeSelectorProps {
  value: number;
  onChange: (size: number) => void;
}

export function PageSizeSelector({ value, onChange }: PageSizeSelectorProps) {
  const options = [10, 100, 1000];

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="pageSize" className="text-sm font-medium text-gray-300">
        Items por página:
      </label>
      <select
        id="pageSize"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-9 rounded-lg border border-white/20 bg-[#0b1422] px-3 text-sm text-white outline-none transition focus:ring-2 focus:ring-[#006AFF]/50"
      >
        {options.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
}
