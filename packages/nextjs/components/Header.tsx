"use client";

import React, { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./SwitchTheme";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BugAntIcon } from "@heroicons/react/24/outline";
import { FaucetButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },

  {
    label: "Debug Contracts",
    href: "/debug",
    icon: <BugAntIcon className="h-4 w-4" />,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-secondary shadow-md" : ""
              } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  return (
    <div className="fixed top-0 w-full bg-background h-[70px] flex items-center flex-shrink-0 justify-between z-50 shadow-md shadow-secondary px-2 sm:px-4">
      <Link href="/" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
        <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
        <p className="text-xl dark:text-white">Neuralfi</p>
      </Link>
      <div className="flex items-center gap-3">
        <ModeToggle />
        <ConnectButton />
      </div>
    </div>
  );
};
