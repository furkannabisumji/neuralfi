"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
//import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@custom-react-hooks/use-media-query";
import { Card, CardBody, Link, Tab, Tabs } from "@heroui/react";
// import { Select, SelectItem } from "@heroui/react";
import { Input } from "~~/components/ui/input";

export function Manager() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Manager</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Funds Manager</DialogTitle>
            <DialogDescription>Manage tokens in your pool. </DialogDescription>
          </DialogHeader>
          <ManagerForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Manager</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Funds Manager</DrawerTitle>
          <DrawerDescription>Manage tokens in your pool. </DrawerDescription>
        </DrawerHeader>
        <ManagerForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export const tokens = [
  { key: "usdt", label: "USDT (Tether)" },
  { key: "dai", label: "DAI (Dai Stablecoin)" },
  { key: "usdc", label: "USDC (USD Coin)" },
  { key: "weth", label: "WETH (Wrapped Ethereum)" },
  { key: "1inch", label: "1INCH (1inch)" },
  { key: "link", label: "LINK (Chainlink)" },
  { key: "shib", label: "SHIB (Shiba Inu)" },
  { key: "wbtc", label: "WBTC (Wrapped Bitcoin)" },
  { key: "matic", label: "MATIC (Polygon)" },
  { key: "crv", label: "CRV (Curve)" },
  { key: "frax", label: "FRAX (Frax)" },
  { key: "bat", label: "BAT (Basic Attention Token)" },
  { key: "ren", label: "REN (Ren Protocol)" },
  { key: "grt", label: "GRT (The Graph)" },
  { key: "mvi", label: "MVI (Metaverse Index)" },
];

export function ManagerForm({ className }: React.ComponentProps<"form">) {
  const [selected, setSelected] = React.useState<React.Key>("deposit");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="flex flex-col w-full">
      <Card className="max-w-full rounded-sm">
        <CardBody className="overflow-hidden">
          <Tabs fullWidth aria-label="Tabs form" size="md" onSelectionChange={setSelected}>
            <Tab key="deposit" title="Deposit">
              <form className="my-8" onSubmit={handleSubmit}>
                <div className="group/btn">
                  <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Token</Label>

                    <Select>
                      <SelectTrigger
                        className="flex  h-10 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm  file:border-0 file:bg-transparent
                      file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600
                      focus-visible:outline-none focus-visible:ring-[2px]  focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600
                       disabled:cursor-not-allowed disabled:opacity-50
                       dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
                      "
                      >
                        <SelectValue placeholder="please select a token" className="text-gray-500" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {tokens.map(token => (
                            <SelectItem key={token.key} value={token.key}>
                              {token.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </LabelInputContainer>
                </div>
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="email">Amount</Label>
                  <Input id="email" placeholder="token amount" type="number" />
                </LabelInputContainer>

                <div className="flex items-center justify-between text-sm pb-3">
                  <p className="font-semibold">Balance</p>
                  <p className="font-normal text-gray-400">0.00</p>
                </div>

                <button
                  className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                  type="submit"
                >
                  Deposit &rarr;
                  <BottomGradient />
                </button>

                <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
              </form>
            </Tab>
            <Tab key="withdraw" title="Withdraw">
              <form className="my-8" onSubmit={handleSubmit}>
                <div className="group/btn">
                  <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Token</Label>

                    <Select>
                      <SelectTrigger
                        className="flex  h-10 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm  file:border-0 file:bg-transparent
                      file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600
                      focus-visible:outline-none focus-visible:ring-[2px]  focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600
                       disabled:cursor-not-allowed disabled:opacity-50
                       dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
                      "
                      >
                        <SelectValue placeholder="please select a token" className="text-gray-500" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {tokens.map(token => (
                            <SelectItem key={token.key} value={token.key}>
                              {token.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </LabelInputContainer>
                </div>
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="email">Amount</Label>
                  <Input id="email" placeholder="token amount" type="number" />
                </LabelInputContainer>

                <div className="flex items-center justify-between text-sm pb-3">
                  <p className="font-semibold">Balance</p>
                  <p className="font-normal text-gray-400">0.00</p>
                </div>

                <button
                  className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                  type="submit"
                >
                  Withdraw &#8595;
                  <BottomGradient />
                </button>

                <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
              </form>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>;
};
