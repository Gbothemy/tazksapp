import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TazKsApp — Earn by Doing",
  description: "Complete tasks, earn real money. Social media, surveys, app testing and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#4b7f52" />
      </head>
      <body>{children}</body>
    </html>
  );
}
