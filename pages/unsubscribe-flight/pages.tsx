import dynamic from "next/dynamic";

// Create a client-side only component that uses the web3 context
const UnsubscribeFlightClient = dynamic(
  () => import("@/components/unsubscribe-flight-client"),
  { ssr: false }
);

// Server-side safe component
export default function UnsubscribeFlightPage() {
  return <UnsubscribeFlightClient />;
}
