import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Jost, Pinyon_Script } from "next/font/google";
import "./globals.css";

const display = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-display",
  display: "swap",
});

const sans = Jost({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const script = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

const description =
  "Uma jornada de desenvolvimento e transformação para mulheres que desejam fortalecer sua identidade, aprofundar sua fé e viver com propósito. Entre para a lista de espera.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Em Busca de Mim · Lista de espera | Tay Queiroz",
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
  themeColor: "#F8F2EB",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${sans.variable} ${script.variable}`}
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
