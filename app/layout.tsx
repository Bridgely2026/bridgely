import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bridgely \u2014 Speak the language. Understand the culture. Belong.",
  description:
    "Bridgely turns the unwritten rules of British communication into something you can actually learn \u2014 practice before it happens, diagnosis after.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
