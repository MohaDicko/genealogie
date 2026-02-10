import type React from "react"
import type { Metadata, Viewport } from "next"
import { Playfair_Display, Source_Sans_3 } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SessionProvider } from "@/components/providers/session-provider"
import { QueryProvider } from "@/components/providers/query-provider"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Famille TOURE | Sahel Généalogie",
  description:
    "Préservez l'histoire de votre famille. Visualisez votre arbre généalogique, documentez les biographies et tracez vos lignées sur plusieurs générations.",
  keywords: ["généalogie", "arbre généalogique", "histoire familiale", "Sahel", "Afrique", "ancêtres"],
  authors: [{ name: "Sahel Généalogie" }],
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f3ef" },
    { media: "(prefers-color-scheme: dark)", color: "#2d2a26" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 2,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${sourceSans.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <SessionProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
