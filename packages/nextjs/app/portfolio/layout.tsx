"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PortfolioHeader } from "./components/PortfoHeader";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconChartPie,
  IconSettings,
  IconTransfer,
  IconUserBolt,
  IconWallet,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { ModeToggle } from "~~/components/SwitchTheme";

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  const links = [
    {
      label: "Portfolio",
      href: "/portfolio",
      icon: <IconChartPie className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Assets",
      href: "/portfolio/assets",
      icon: <IconWallet className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Transactions",
      href: "/portfolio/transactions",
      icon: <IconTransfer className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Settings",
      href: "/portfolio/settings",
      icon: <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div className="h-screen">
      <PortfolioHeader />
      <div
        className={cn(
          " flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1  border border-neutral-200 dark:border-neutral-700 overflow-hidden",
          "h-[93%]",
        )}
      >
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>
            {/* <div>
              <SidebarLink
                link={{
                  label: "Manu Arora",
                  href: "#",
                  icon: (
                    <Image
                      src="https://assets.aceternity.com/manu.png"
                      className="h-7 w-7 flex-shrink-0 rounded-full"
                      width={50}
                      height={50}
                      alt="Avatar"
                    />
                  ),
                }}
              />
            </div> */}
            <ModeToggle />
          </SidebarBody>
        </Sidebar>
        {children}
      </div>
    </div>
  );
}
const Logo = () => {
  return (
    <Link href="#" className="font-normal flex sm:hidden  space-x-2 items-center text-sm text-black py-1 relative z-20">
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium  text-black dark:text-white whitespace-pre"
      >
        Neuralfi
      </motion.span>
    </Link>
  );
};
const LogoIcon = () => {
  return (
    <Link href="#" className="font-normal flex sm:hidden space-x-2 items-center text-sm text-black py-1 relative z-20">
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
