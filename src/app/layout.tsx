import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Our Company - شركتنا",
  description: "A modern multilingual website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
