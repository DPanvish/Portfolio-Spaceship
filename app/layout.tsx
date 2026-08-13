import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

// Outfit: clean, modern, geometric — suits the spaceship UI aesthetic
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Spaceship Portfolio",
  description: "An interactive 3D portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} h-full`}>
      <body className="min-h-full bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
