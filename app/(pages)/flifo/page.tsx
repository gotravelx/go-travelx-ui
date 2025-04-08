import { Web3Provider } from "@/contexts/web3-context";
import FlightSearch from "@/page";

export default async function Component() {
  return (
    
      <div className="p-4 text-center mt-auto">
        <Web3Provider>
          <FlightSearch/>
        </Web3Provider>
      </div>
    
  );
}
