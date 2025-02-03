"use client";

import TokenIdentity from "./components/TokenIdentity";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { Alchemy, Network } from "alchemy-sdk";
import { MoreHorizontal } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { formatNumber } from "~~/utils/formatNumber";

const getTokenMetaData = async (token: string) => {
  if (!token) return null;

  const config = {
    apiKey: "RFQWPxVBq8KY8lRtViUEKhrtffVyfoNq", // Replace this with your actual API key
    network: Network.ETH_MAINNET,
  };

  const alchemy = new Alchemy(config);

  try {
    // Fetch metadata from Alchemy
    const { decimals, logo, name, symbol } = await alchemy.core.getTokenMetadata(token);
    return { decimals, logo, name, symbol };
  } catch (error) {
    console.error("Error fetching token metadata:", error);
    return null; // In case of an error, return null
  }
};

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type PortfolioMetrics = {
  id: string; // Unique identifier for the BTC asset in the portfolio
  address: string; //token address
  currentPrice: number; // Current price of BTC in USD (or your preferred currency)
  priceChange24h: number; // 24-hour price change in percentage (%)
  portfolioWeight: number; // The percentage of BTC in the portfolio
  marketCap: number; // Market capitalization of BTC (in USD)
  maxDrawdown: number; // Maximum drawdown of BTC over 1 year (percentage)
  sharpeRatio: number; // Sharpe ratio of BTC (risk-adjusted return)
};

export const columns: ColumnDef<PortfolioMetrics>[] = [
  {
    accessorKey: "address",
    header: () => <div className="text-center">Token</div>,
    cell: ({ row }) => {
      return <TokenIdentity tokenAddress={row.getValue("address")} />;
    },
  },
  {
    accessorKey: "currentPrice",
    header: () => <div className="text-center">Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("currentPrice"));
      const formattedAmount = formatNumber(amount); // Use the reusable function

      return <div className="text-center font-medium">${formattedAmount}</div>;
    },
  },
  {
    accessorKey: "address",
    header: () => <div className="text-center">Balance</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("currentPrice")); //TODO: replace with get user balance

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "priceChange24h",
    header: () => <div className="text-center">Change (24h)</div>,
    cell: ({ row }) => {
      const priceChange = row.getValue("priceChange24h");

      // Determine the color based on the value of priceChange24h
      let colorClass = "";
      if (priceChange < 0) {
        colorClass = "text-red-500"; // Red if negative
      } else if (priceChange > 0) {
        colorClass = "text-green-500"; // Green if positive
      } else {
        colorClass = ""; // No color if zero
      }

      return <div className={`text-center font-medium ${colorClass}`}>{priceChange}%</div>;
    },
  },
  {
    accessorKey: "portfolioWeight",
    header: () => <div className="text-center">Weight</div>,
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.getValue("portfolioWeight")}</div>;
    },
  },
  {
    accessorKey: "marketCap",
    header: () => <div className="text-center">Market Cap</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("marketCap"));
      const formattedAmount = formatNumber(amount); // Use the reusable function

      return <div className="text-center font-medium">${formattedAmount}</div>;
    },
  },

  {
    accessorKey: "sharpeRatio",
    header: () => <div className="text-center">Sharpe Ratio</div>,
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.getValue("sharpeRatio")}</div>;
    },
  },

  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const payment = row.original;

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
  //             Copy payment ID
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>View customer</DropdownMenuItem>
  //           <DropdownMenuItem>View payment details</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];
