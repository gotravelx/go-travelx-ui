"use client";

import { useEffect } from "react";
import FlightSearch from "@/components/flight-search";
import ProtectedRoute from "@/components/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function FlifoPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent("/flifo")}`);
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <ProtectedRoute>
      <FlightSearch />
    </ProtectedRoute>
  );
}
