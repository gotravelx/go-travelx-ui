"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import airportCities from "@/utils/airportsCodesAndCities.json";

type Airport = {
  code: string;
  city: string;
  country: string;
};

export function AirportAutocomplete({
  onSelect,
  className,
  value,
  ...props
}: {
  onSelect?: (code: string) => void;
  className?: string;
  value?: string;
} & React.ComponentProps<"input">) {
  const [query, setQuery] = React.useState("");
  const [filtered, setFiltered] = React.useState<Airport[]>([]);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (typeof value === "string") {
      setQuery(value?.toUpperCase());
    } else {
      setQuery("");
    }
  }, [value]);

  React.useEffect(() => {
    if (!query.trim()) {
      setFiltered([]);
      setShowDropdown(false);
      return;
    }
    const results = Object.entries(airportCities)
      .map(([code, data]: [string, any]) => ({
        code: code.toUpperCase(),
        city: data.city,
        country: data.country,
      }))
      .filter(
        (a) =>
          a.code.toLowerCase().includes(query.toLowerCase()) ||
          a.city.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 10);
    setFiltered(results);
    setShowDropdown(results.length > 0);
  }, [query]);

  const handleSelect = (code: string) => {
    setQuery(code);
    setShowDropdown(false);
    onSelect?.(code);
    inputRef.current?.blur();
  };

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        {...props}
        className={cn(className)}
        value={query}
        onChange={(e) => setQuery(e.target.value?.toUpperCase())}
        placeholder="Enter Station Code"
      />
      {showDropdown && (
        <ul className="absolute z-10 mt-1 w-full rounded-md border border-border bg-popover text-popover-foreground shadow-md max-h-56 overflow-auto">
          {filtered.map((airport) => (
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(airport.code);
              }}
            >
              <li
                key={airport.code}
                className="cursor-pointer px-3 py-2 hover:bg-accent hover:text-accent-foreground"
              >
                <span className="font-medium">{airport.code}</span> –{" "}
                {airport.city}, {airport.country}
              </li>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}
