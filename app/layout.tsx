import type { Metadata } from "next";
import { Outfit, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

// Outfit: clean, modern, geometric — suits the spaceship UI aesthetic
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-tech",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Spaceship Portfolio",
  description: "An interactive 3D portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${shareTechMono.variable}`}>
      <body className="min-h-full bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
