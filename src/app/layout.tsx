import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import { Provider } from "@/components/ui/provider";
import { QueryProvider } from "@/components/provider/QueryProvider";
import "./globals.css";
import { AirportProvider } from "@/components/provider/AirportContext";
import { FloatingNav } from "@/components/layout/FloatingButton";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
export const metadata: Metadata = {
  title: "SkyConnect Explorer | Proyecto realizado por Jose Feliciano",
  description: "Explora aeropuertos del mundo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <QueryProvider>
        <AirportProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <FloatingNav />
            <Provider>
              {children}
              <Toaster position="top-right" reverseOrder={false} />
            </Provider>
          </body>
        </AirportProvider>
      </QueryProvider>
    </html>
  );
}
