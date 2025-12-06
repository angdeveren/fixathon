import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VALKYRIE PROTOCOL",
  description: "Emergency Response System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
