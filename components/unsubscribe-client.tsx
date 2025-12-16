"use client";

import { useEffect, useState } from "react";
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

export default function UnsubscribeClient() {
  const [email, setEmail] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmail(params.get("email"));
  }, []);

  const handleUnsubscribe = async () => {
    if (!email) {
      setStatus("error");
      setMessage("Email not found in unsubscribe link.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/newsletter/unsubscribe?email=${encodeURIComponent(
          email
        )}`,
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
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again later.");
    }
  };

  const handleClose = () => {
    window.close(); 
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-900 dark:text-white">
            Unsubscribe
          </CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-300">
            {email ? `Email: ${email}` : "Invalid unsubscribe link."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {status === "idle" && (
            <p className="text-center text-gray-600 dark:text-gray-300">
              Are you sure you want to unsubscribe from the GoTravelX newsletter?
            </p>
          )}

          {status === "error" && (
            <Alert variant="destructive">
              <AlertDescription className="text-white">
                {message}
              </AlertDescription>
            </Alert>
          )}

          {status === "success" && (
            <Alert>
              <AlertDescription className="text-gray-900 dark:text-white">
                {message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          {status === "idle" && (<>
            <Button className="w-full" onClick={handleUnsubscribe}>
            Unsubscribe
          </Button>

                    <Button
                    variant="outline"
                    className="w-full dark:text-white"
                    onClick={handleClose}
                    >
                    Cancel
                    </Button>
                    </>
          )}

          {status === "loading" && (
            <Button disabled className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Unsubscribing...
            </Button>
          )}

{(status === "success" || status === "error") && (
            <Button
              variant="outline"
              className="w-full dark:text-white"
              onClick={handleClose}
            >
              Close
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
