
import dynamic from "next/dynamic";

const UnsubscribeFlightClient = dynamic(
  () => import("@/components/unsubscribe-flight-client"),
  { ssr: false }
);

// Server-side safe component
import { useEffect, useState } from "react";

export default function UnsubscribeFlightPage() {
  return <UnsubscribeFlightClient />;
}
