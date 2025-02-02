"use client";

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
import { MoreHorizontal } from "lucide-react";
import { ArrowUpDown } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Transaction = {
  id: string;
  volume: number;
  hash: string;
  chain: string;
  time: string;
  type: string;
  status: "pending" | "processing" | "success" | "failed";
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "hash",
    header: () => <div className="text-center">Hash</div>,
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.getValue("hash")}</div>;
    },
  },
  {
    accessorKey: "volume",
    header: () => <div className="text-center">Volume</div>,
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.getValue("volume")}</div>;
    },
  },
  {
    accessorKey: "chain",
    header: () => <div className="text-center">Chain</div>,
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.getValue("chain")}</div>;
    },
  },
  {
    accessorKey: "type",
    header: () => <div className="text-center">Type</div>,
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.getValue("type")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status");

      const statusColors = {
        pending: "text-yellow-500",
        processing: "text-blue-500",
        success: "text-green-500",
        failed: "text-red-500",
      };

      return <div className={`text-center font-medium ${statusColors[status] || "text-gray-500"}`}>{status}</div>;
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
