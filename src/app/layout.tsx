import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shader Forge",
  description: "Next.js + Regl Shader Scaffold",
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
