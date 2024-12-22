import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DreamScape",
  description: "Created by Karanjot Gaidu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>

    <html lang="en">
      <body
        className={`{inter.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SignedOut>
            <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton showName/>
          {children} 
        </SignedIn>
      </body>
    </html>
    </ClerkProvider>
  );
}
