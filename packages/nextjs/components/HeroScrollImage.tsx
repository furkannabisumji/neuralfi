"use client";

import React from "react";
import Image from "next/image";
import { ContainerScroll } from "./ui/container-scroll-animation";

export function HeroScrollImage() {
  return (
    <div className="flex flex-col overflow-hidden md:-mt-40">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="md:text-4xl font-semibold text-black dark:text-white">
              Unleash the power of <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">Neuralfi</span>
            </h1>
          </>
        }
      >
        <Image
          src={`/app.png`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
