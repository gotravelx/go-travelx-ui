import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MetaMaskGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        href="/"
        className="flex items-center text-primary hover:underline mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to home
      </Link>

      <h1 className="text-3xl font-bold mb-8">
        How to Install and Use MetaMask
      </h1>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>What is MetaMask?</CardTitle>
            <CardDescription>
              A crypto wallet & gateway to blockchain apps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              MetaMask is a software cryptocurrency wallet used to interact with
              the Ethereum blockchain. It allows you to access your Ethereum
              wallet through a browser extension or mobile app, which can then
              be used to interact with decentralized applications like
              GoTravelX.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 1: Install MetaMask</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-5 space-y-4">
              <li>
                Visit the official{" "}
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  MetaMask download page
                </a>
              </li>
              <li>
                Choose your preferred platform (Chrome, Firefox, Brave, Edge
                browser extension or iOS/Android mobile app)
              </li>
              <li>
                Click "Install MetaMask" and follow the browser's extension
                installation process
              </li>
              <li>
                Once installed, the MetaMask fox icon will appear in your
                browser's extension area
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 2: Create a Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-5 space-y-4">
              <li>Click on the MetaMask icon in your browser</li>
              <li>Click "Get Started"</li>
              <li>Choose "Create a Wallet"</li>
              <li>
                Create a password (this is for accessing MetaMask on your
                device)
              </li>
              <li>
                You'll be shown a Secret Recovery Phrase (12 words) - write this
                down and store it securely offline.
                <strong className="block mt-2 text-red-500">
                  Never share this phrase with anyone!
                </strong>
              </li>
              <li>
                Confirm your Secret Recovery Phrase by selecting the words in
                the correct order
              </li>
              <li>Click "All Done" to complete the setup</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 3: Connect to GoTravelX</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-5 space-y-4">
              <li>Return to the GoTravelX website</li>
              <li>Click the "Connect MetaMask" button</li>
              <li>
                A MetaMask popup will appear asking for permission to connect
              </li>
              <li>
                Click "Connect" to allow GoTravelX to connect to your wallet
              </li>
              <li>
                You're now connected and can use all features of GoTravelX!
              </li>
            </ol>

            <div className="mt-6">
              <Link href="/">
                <Button className="gradient-border">Return to GoTravelX</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Never share your Secret Recovery Phrase or private keys with
                anyone
              </li>
              <li>
                Be cautious of phishing attempts - always verify you're on the
                correct website
              </li>
              <li>Consider using a hardware wallet for additional security</li>
              <li>Keep your browser and MetaMask extension updated</li>
              <li>
                Disconnect your wallet from websites when you're done using them
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
