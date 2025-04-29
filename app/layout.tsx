"use client";

import { ThemeProvider } from "next-themes";
import { StateProvider } from "@/providers/state-provider";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
        >
          <StateProvider>
            {children}
          </StateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}