import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Maceng | Calculadoras de Engenharia Mecânica",
  description:
    "Plataforma profissional de cálculos técnicos para engenharia mecânica. Dimensionamento, tolerâncias ISO, hidráulica, soldagem e muito mais. Baseado em normas ABNT, ISO e DIN.",
  keywords: [
    "engenharia mecânica",
    "calculadora técnica",
    "dimensionamento",
    "tolerâncias ISO",
    "ABNT",
    "cálculos estruturais",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
