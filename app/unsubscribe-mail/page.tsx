"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function UnsubscribePage() {
const searchParams = useSearchParams();
const email = searchParams ? searchParams.get("email") : null;

const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
);
const [message, setMessage] = useState("");

  const handleUnsubscribe = async () => {
    if (!email) {
      setStatus("error");
      setMessage("Email not found in unsubscribe link.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/newsletter/unsubscribe?email=${email}`,
        { method: "DELETE" }
      );

      const result = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(
          result?.message || "You have been unsubscribed successfully."
        );
      } else {
        setStatus("error");
        setMessage(result?.message || "Failed to unsubscribe.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  const handleCancel = () => {
    window.close(); // closes tab if opened from email
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Unsubscribe
          </CardTitle>
          <CardDescription className="text-center">
            {email
              ? `Email: ${email}`
              : "We could not detect an email in your unsubscribe link."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {status === "error" && (
            <Alert variant="destructive">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {status === "success" && (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {status === "idle" && (
            <p className="text-center text-gray-600">
              Are you sure you want to unsubscribe from GoTravelX Newsletter?
            </p>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-3">
          {status === "idle" && (
            <>
              <Button onClick={handleUnsubscribe} className="w-full">
                Unsubscribe
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </>
          )}

          {status === "loading" && (
            <Button disabled className="w-full">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Unsubscribing...
            </Button>
          )}

          {(status === "success" || status === "error") && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.close()}
            >
              Close
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
