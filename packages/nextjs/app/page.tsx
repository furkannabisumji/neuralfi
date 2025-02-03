"use client";

import Link from "next/link";
import { Input } from "@heroui/react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Header } from "~~/components/Header";
import { HeroScrollImage } from "~~/components/HeroScrollImage";
import { Address } from "~~/components/scaffold-eth";
import { Button } from "~~/components/ui/moving-border";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <div className=" overflow-y-auto">
      <Header />
      <div className="flex items-center flex-col flex-1 pt-[90px] ">
        <div className="px-5 flex flex-col justify-center gap-4 min-h-[200px] ">
          <div className="flex flex-col gap-4 items-center text-center">
            <h1 className="text-center font-bold text-xl md:text-4xl">Your AI-Powered Portfolio Manager</h1>
            <p className="text-sm md:text-md">
              Let an AI agent trade, optimize, and grow your portfolio—effortlessly. 🚀
            </p>
          </div>
        </div>
        <Button
          borderRadius="1.75rem"
          className="bg-white dark:bg-neutral-900 cursor-pointer text-black dark:text-white border-neutral-200 dark:border-slate-800"
        >
          Get started
        </Button>

        <HeroScrollImage />
      </div>
    </div>
  );
};

export default Home;
