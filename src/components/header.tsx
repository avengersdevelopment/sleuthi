"use client";

import { cn } from "@/utils/classname";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationItem {
  title: string;
  link: string;
}

export const navigations: NavigationItem[] = [
  {
    title: "Home",
    link: "/",
  },
  {
    title: "Docs",
    link: "/docs",
  },
  {
    title: "Chatbot",
    link: "/chatbot",
  },
];

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 flex w-full justify-center rounded-xl border border-black backdrop-blur-sm">
      <div className="flex w-[90vw] items-center justify-between px-[2vw] py-[1vh]">
        <Link href={"/"}>
          <p className="text-[1.5vw] font-bold text-black">sleuthi</p>
        </Link>

        <div className="flex gap-[3vw]">
          {navigations.map((navigation, index) => {
            const isActive = pathname === navigation.link;

            return (
              <Link key={index} href={navigation.link}>
                <p
                  className={cn(
                    "text-black text-[1vw]",
                    isActive ? "font-bold" : "font-normal",
                  )}
                >
                  {navigation.title}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;
