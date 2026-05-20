import type { Metadata, Viewport } from "next";
import { Inter, Poppins, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://lucia-jeans.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Lucia Jeans — Moda femenina premium",
    template: "%s | Lucia Jeans"
  },
  description:
    "Lucia Jeans — Jeans, blusas y vestidos para mujeres que aman verse increíbles. Tienda premium con envío a todo el país.",
  keywords: [
    "Lucia Jeans",
    "moda femenina",
    "jeans mujer",
    "vestidos",
    "blusas",
    "tienda premium",
    "ropa Perú"
  ],
  authors: [{ name: "Lucia Jeans" }],
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: SITE_URL,
    siteName: "Lucia Jeans",
    title: "Lucia Jeans — Moda femenina premium",
    description:
      "Descubre los jeans y prendas premium que están enamorando a miles de mujeres.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Lucia Jeans — Moda femenina premium",
    description: "Jeans y moda femenina premium.",
    images: ["/og-image.jpg"]
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" }
  ],
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable} ${playfair.variable}`}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="bottom-right"
            richColors
            toastOptions={{
              classNames: {
                toast: "rounded-xl border border-border shadow-card"
              }
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
