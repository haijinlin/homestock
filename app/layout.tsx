import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import "./globals.css";

export const metadata: Metadata = {
  title: "HomeStock | Household inventory",
  description: "Keep household supplies organized and stocked.",
  applicationName: "HomeStock",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HomeStock",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#24563c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ServiceWorkerRegister />
        <header className="border-b bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-forest">
              <img alt="" className="h-9 w-9" src="/homestock-logo.svg" />
              HomeStock
            </Link>
            <nav className="flex items-center gap-2">
              <Link href="/categories" className="button-secondary">
                Categories
              </Link>
              <Link href="/items/new" className="button-primary">
                Add item
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
