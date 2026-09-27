import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Wawa — Tu sabiduría, su futuro",
    template: "%s · Wawa",
  },
  description:
    "Wawa es una cápsula del tiempo digital: guarda recuerdos, consejos y secretos para que tus hijos los descubran en el momento justo del futuro.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdf9f2" },
    { media: "(prefers-color-scheme: dark)", color: "#17110c" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${jakarta.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
