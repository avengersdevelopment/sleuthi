import Aos from "@/components/aos";
import Providers from "@/components/providers";
import { createClient } from "@/utils/supabase/server";
import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import { twMerge } from "tailwind-merge";
import "./globals.css";

const inter = Inter({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "App Name",
  description: "App Description",
  openGraph: {
    title: "App Name",
    description: "App Description",
    url: "/",
    images: [
      {
        url: "/preview.png",
        alt: "App Preview",
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
        <body className={twMerge(inter.variable, "font-inter antialiased")}>
          <Providers config={configs?.[0] || null}>{children}</Providers>
        </body>
      </html>
    </>
  );
}
