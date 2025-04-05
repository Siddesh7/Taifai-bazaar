import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { SocketProvider } from '../contexts/SocketContext';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Taifei Bazaar",
  description: "A night market metaverse for frens",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head></head>
      <body
        className={`${inter.variable} antialiased`}
      >
        <ClientProviders>
          <SocketProvider>
            {children}
          </SocketProvider>
        </ClientProviders>
      </body>
    </html>
  );
}
