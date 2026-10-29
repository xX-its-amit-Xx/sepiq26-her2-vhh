import type { Metadata, Viewport } from "next";
import { Familjen_Grotesk, Literata } from "next/font/google";
import "./globals.css";
import Shell from "@/components/Shell";

const familjen = Familjen_Grotesk({ variable: "--font-familjen", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const literata = Literata({ variable: "--font-literata", subsets: ["latin"], style: ["normal", "italic"] });

export const metadata: Metadata = {
  title: "SEPIQ 2026 Intelligence",
  description: "What we know about the SEPIQ 2026 HER2 nanobody epitope-prediction challenge: the problem, the data, the methods and the plan.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${familjen.variable} ${literata.variable}`}>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
