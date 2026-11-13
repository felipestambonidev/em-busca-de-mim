import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Montserrat, Mrs_Saint_Delafield } from "next/font/google";
import "./fonts.css";
import "./globals.css";
import "./sections.css";

/*
 * Fontes da marca:
 *   Bebas Kai          → títulos      (arquivo em /public/fonts; fallback: Bebas Neue, do mesmo estúdio)
 *   Brittany Signature → assinaturas  (arquivo em /public/fonts; fallback: Mrs Saint Delafield)
 *   Montserrat         → texto corrido
 */
const sans = Montserrat({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-sans",
  display: "swap",
});

const displayFallback = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display-fallback",
  display: "swap",
});

const scriptFallback = Mrs_Saint_Delafield({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script-fallback",
  display: "swap",
});

const description =
  "Uma jornada de desenvolvimento e transformação para mulheres que desejam fortalecer sua identidade, aprofundar sua fé e viver com propósito.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Em Busca de Mim | Tay Queiroz",
  description,
  openGraph: {
    title: "Em Busca de Mim — com Tay Queiroz",
    description,
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/fotos/tay-jardim.jpg", width: 1333, height: 2000, alt: "Tay Queiroz" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#F7F1EC",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${sans.variable} ${displayFallback.variable} ${scriptFallback.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Marca que o JS está ativo para esconder o hero até a animação de entrada (sem flash). */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
