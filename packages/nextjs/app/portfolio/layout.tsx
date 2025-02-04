"use client";

import React, { useState } from "react";
import { Logo, LogoIcon } from "./components/LogoController";
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
            <ModeToggle />
          </SidebarBody>
        </Sidebar>
        {children}
      </div>
    </div>
  );
}
