import { contractService } from "@/services/contract-service";
import dynamic from "next/dynamic";

// Create a client-side only component that uses the web3 context
const UnsubscribeFlightClient = dynamic(
  () => import("@/components/unsubscribe-flight-client"),
  { ssr: false }
);

// Server-side safe component
import { useEffect, useState } from "react";

export default function UnsubscribeFlightPage() {
  const [walletAddress, setWalletAddress] = useState<string>("");

  useEffect(() => {
    contractService.getWalletAddress().then(setWalletAddress);
  }, []);

  return <UnsubscribeFlightClient walletAddress={walletAddress} />;
}
