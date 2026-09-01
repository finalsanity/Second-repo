import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wonderwall | Mystery Box Day",
  description: "Open a wall of tiny surprises and discover something wonderful.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
