import UnsubscribeClient from "@/components/unsubscribe-client";
import { Suspense } from "react";


export default function Page() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <UnsubscribeClient />
    </Suspense>
  );
}
