"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  // This ensures we only run the protection logic on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run this effect on the client side
    if (isClient && !isLoading && !isAuthenticated) {
      // Redirect to login with the current path as the redirect URL
      router.push(`/login?redirect=${encodeURIComponent(pathname || "/")}`);
    }
  }, [isAuthenticated, isLoading, router, pathname, isClient]);

  // Don't render anything during SSR or when loading on client
  if (!isClient || isLoading) {
    return (
      <div className="container mx-auto pt-24 px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
