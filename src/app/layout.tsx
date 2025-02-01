import Aos from "@/components/aos";
import Providers from "@/components/providers";
import { createClient } from "@/utils/supabase/server";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { twMerge } from "tailwind-merge";
import "./globals.css";

const inter = Inter({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
});

const arkipelago = localFont({
  src: [
    {
      path: "../../public/fonts/arkipelago.otf",
      weight: "400",
    },
    {
      path: "../../public/fonts/arkipelago.otf",
      weight: "700",
    },
  ],
  variable: "--font-arkipelago",
});

const avigea = localFont({
  src: [
    {
      path: "../../public/fonts/avigea.ttf",
      weight: "400",
    },
    {
      path: "../../public/fonts/avigea.ttf",
      weight: "700",
    },
  ],
  variable: "--font-avigea",
});

export const metadata: Metadata = {
  title: "Sleuthi",
  description: "Your friendly AI assistant, ready to fetch info with a smile",
  openGraph: {
    title: "Sleuthi",
    description: "Your friendly AI assistant, ready to fetch info with a smile",
    url: "/",
    images: [
      {
        url: "/banner.png",
        alt: "Slethi",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: configs } = await supabase.from("configs").select();

  return (
    <>
      <Aos />
      <html lang="en" className="relative">
        <body
          className={twMerge(
            inter.variable,
            arkipelago.variable,
            avigea.variable,
            "font-inter antialiased",
          )}
        >
          <Providers config={configs?.[0] || null}>{children}</Providers>
        </body>
      </html>
    </>
  );
}
