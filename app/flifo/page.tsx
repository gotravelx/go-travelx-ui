"use client";

import ProtectedRoute from "@/components/protected-route";
import FlightSearch from "@/components/flight-search";

export default function FlifoPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto ">
        <FlightSearch />
      </div>
    </ProtectedRoute>
  );
}
