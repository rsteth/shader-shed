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
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.28/dist/katex.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
