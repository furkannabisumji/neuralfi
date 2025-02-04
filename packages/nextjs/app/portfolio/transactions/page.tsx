import { Transaction, columns } from "../columns";
import { DataTable } from "../data-table";
import { TransactionAnalysis } from "./components/TransactionAnalysis";
import { NextPage } from "next";

async function getData(): Promise<Transaction[]> {
  // Fetch data from your API here.
  return [
    {
      id: "tx001",
      volume: 100,
      hash: "0xa1b2c3d4e5f6",
      chain: "ETH",
      time: "2024-02-01T12:00:00Z",
      type: "deposit",
      status: "pending",
    },
    {
      id: "tx002",
      volume: 200,
      hash: "0xb2c3d4e5f6g7",
      chain: "BTC",
      time: "2024-02-01T12:10:00Z",
      type: "withdrawal",
      status: "success",
    },
    {
      id: "tx003",
      volume: 300,
      hash: "0xc3d4e5f6g7h8",
      chain: "SOL",
      time: "2024-02-01T12:20:00Z",
      type: "transfer",
      status: "failed",
    },
    {
      id: "tx004",
      volume: 400,
      hash: "0xd4e5f6g7h8i9",
      chain: "ETH",
      time: "2024-02-01T12:30:00Z",
      type: "swap",
      status: "processing",
    },
    {
      id: "tx005",
      volume: 500,
      hash: "0xe5f6g7h8i9j0",
      chain: "BTC",
      time: "2024-02-01T12:40:00Z",
      type: "deposit",
      status: "pending",
    },
    {
      id: "tx006",
      volume: 600,
      hash: "0xf6g7h8i9j0k1",
      chain: "SOL",
      time: "2024-02-01T12:50:00Z",
      type: "withdrawal",
      status: "success",
    },
    {
      id: "tx007",
      volume: 700,
      hash: "0xa7b8c9d0e1f2",
      chain: "ETH",
      time: "2024-02-01T13:00:00Z",
      type: "transfer",
      status: "failed",
    },
    {
      id: "tx008",
      volume: 800,
      hash: "0xb8c9d0e1f2g3",
      chain: "BTC",
      time: "2024-02-01T13:10:00Z",
      type: "swap",
      status: "processing",
    },
    {
      id: "tx009",
      volume: 900,
      hash: "0xc9d0e1f2g3h4",
      chain: "SOL",
      time: "2024-02-01T13:20:00Z",
      type: "deposit",
      status: "pending",
    },
    {
      id: "tx010",
      volume: 1000,
      hash: "0xd0e1f2g3h4i5",
      chain: "ETH",
      time: "2024-02-01T13:30:00Z",
      type: "withdrawal",
      status: "success",
    },
  ];
}

const Portfolio: NextPage = async () => {
  const data = await getData();

  return (
    <div className="flex h-full w-full overflow-y-auto ">
      <div className="p-2 md:p-10 h-auto overflow-y-auto  rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-20 flex-1 w-full ">
        <div className="">
          <h3 className="text-2xl font-bold leading-relaxed">Transactions</h3>
          <TransactionAnalysis />
        </div>

        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Portfolio;
