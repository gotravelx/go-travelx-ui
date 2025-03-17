import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Chrome,
  ChromeIcon as Firefox,
  Globe,
  Shield,
  CheckCircle,
} from "lucide-react";

export default function MetaMaskGuidePage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Link href="/" className="flex items-center text-sm mb-6 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to home
      </Link>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            MetaMask Installation Guide
          </h1>
          <p className="text-muted-foreground">
            Follow this step-by-step guide to install and set up MetaMask for
            GoTravelX
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              What is MetaMask?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              MetaMask is a cryptocurrency wallet and gateway to blockchain
              applications. It allows you to:
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Store and manage your digital assets securely</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Connect to blockchain applications like GoTravelX</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Manage your identity on the blockchain</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  Subscribe to flight updates and manage your subscriptions on
                  GoTravelX
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 1: Install MetaMask</CardTitle>
            <CardDescription>
              Choose your browser and install the MetaMask extension
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <Chrome className="h-8 w-8 text-blue-500 mb-2" />
                  <CardTitle className="text-lg">Chrome</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <ol className="text-sm space-y-2 list-decimal list-inside">
                    <li>Visit the Chrome Web Store</li>
                    <li>Click "Add to Chrome"</li>
                    <li>Confirm the installation</li>
                  </ol>
                </CardContent>
                <div className="p-4 pt-0">
                  <a
                    href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button className="w-full">Install for Chrome</Button>
                  </a>
                </div>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <Firefox className="h-8 w-8 text-orange-500 mb-2" />
                  <CardTitle className="text-lg">Firefox</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <ol className="text-sm space-y-2 list-decimal list-inside">
                    <li>Visit Firefox Add-ons</li>
                    <li>Click "Add to Firefox"</li>
                    <li>Confirm the installation</li>
                  </ol>
                </CardContent>
                <div className="p-4 pt-0">
                  <a
                    href="https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button className="w-full">Install for Firefox</Button>
                  </a>
                </div>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <Globe className="h-8 w-8 text-green-500 mb-2" />
                  <CardTitle className="text-lg">Other Browsers</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <ol className="text-sm space-y-2 list-decimal list-inside">
                    <li>Visit MetaMask website</li>
                    <li>Select your browser</li>
                    <li>Follow installation steps</li>
                  </ol>
                </CardContent>
                <div className="p-4 pt-0">
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button className="w-full">Visit MetaMask</Button>
                  </a>
                </div>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 2: Set Up Your Wallet</CardTitle>
            <CardDescription>
              Create a new wallet or import an existing one
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Creating a New Wallet</h3>
              <ol className="text-sm space-y-3 list-decimal pl-5">
                <li>
                  <span className="font-medium">
                    Click the MetaMask icon in your browser
                  </span>
                  <p className="text-muted-foreground mt-1">
                    After installation, you'll see the MetaMask fox icon in your
                    browser's toolbar.
                  </p>
                </li>
                <li>
                  <span className="font-medium">Click "Get Started"</span>
                </li>
                <li>
                  <span className="font-medium">Select "Create a Wallet"</span>
                </li>
                <li>
                  <span className="font-medium">Create a strong password</span>
                  <p className="text-muted-foreground mt-1">
                    This password will be used to unlock your MetaMask on this
                    device.
                  </p>
                </li>
                <li>
                  <span className="font-medium">
                    Secure your Secret Recovery Phrase
                  </span>
                  <p className="text-muted-foreground mt-1">
                    MetaMask will show you a 12-word phrase. Write this down on
                    paper and store it securely.
                    <strong className="block mt-1 text-red-500">
                      Never share this phrase with anyone!
                    </strong>
                  </p>
                </li>
                <li>
                  <span className="font-medium">
                    Confirm your Secret Recovery Phrase
                  </span>
                  <p className="text-muted-foreground mt-1">
                    Select the words in the correct order to verify you've saved
                    your phrase.
                  </p>
                </li>
                <li>
                  <span className="font-medium">Your wallet is ready!</span>
                </li>
              </ol>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Importing an Existing Wallet</h3>
              <ol className="text-sm space-y-3 list-decimal pl-5">
                <li>
                  <span className="font-medium">
                    Click the MetaMask icon in your browser
                  </span>
                </li>
                <li>
                  <span className="font-medium">Click "Get Started"</span>
                </li>
                <li>
                  <span className="font-medium">Select "Import wallet"</span>
                </li>
                <li>
                  <span className="font-medium">
                    Enter your Secret Recovery Phrase
                  </span>
                  <p className="text-muted-foreground mt-1">
                    Type in your 12-word recovery phrase.
                  </p>
                </li>
                <li>
                  <span className="font-medium">Create a new password</span>
                </li>
                <li>
                  <span className="font-medium">Complete the import</span>
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 3: Connect to GoTravelX</CardTitle>
            <CardDescription>
              Connect your MetaMask wallet to use GoTravelX
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="text-sm space-y-3 list-decimal pl-5">
              <li>
                <span className="font-medium">
                  Return to the GoTravelX website
                </span>
              </li>
              <li>
                <span className="font-medium">Click "Connect MetaMask"</span>
              </li>
              <li>
                <span className="font-medium">
                  Approve the connection request
                </span>
                <p className="text-muted-foreground mt-1">
                  MetaMask will open a popup asking for permission to connect to
                  GoTravelX. Click "Connect" to approve.
                </p>
              </li>
              <li>
                <span className="font-medium">Start using GoTravelX!</span>
                <p className="text-muted-foreground mt-1">
                  You're now connected and can subscribe to flight updates and
                  manage your subscriptions.
                </p>
              </li>
            </ol>

            <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 mt-6">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-800 dark:text-amber-400">
                    Security Tips
                  </h3>
                  <ul className="text-sm space-y-2 mt-2 list-disc pl-5 text-amber-700 dark:text-amber-300">
                    <li>Never share your Secret Recovery Phrase with anyone</li>
                    <li>
                      Be cautious of phishing attempts - always check the URL
                    </li>
                    <li>
                      Consider using a hardware wallet for additional security
                    </li>
                    <li>Keep your browser and MetaMask extension updated</li>
                    <li>
                      Disconnect from websites when you're done using them
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Link href="/">
            <Button size="lg">Return to GoTravelX</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
