import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TazKsApp — Earn by Doing",
  description: "Complete tasks, earn real money. Social media, surveys, app testing and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
