import { memo } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Wallet } from "lucide-react";

const WalletConnectionCard = memo(
  ({
    error,
    isLoading,
    onConnect,
  }: {
    error: string | null;
    isLoading: boolean;
    onConnect: () => void;
  }) => (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Connect Wallet</CardTitle>
        <CardDescription>
          Connect your MetaMask wallet to access flight search
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button
          className="w-full gradient-border"
          onClick={onConnect}
          disabled={isLoading}
        >
          <Wallet className="mr-2 h-4 w-4" />
          {isLoading ? "Connecting..." : "Connect MetaMask"}
        </Button>
      </CardContent>
    </Card>
  )
);

// Ensure the default export
export default WalletConnectionCard;
