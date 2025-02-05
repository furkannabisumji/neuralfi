import { Transaction, columns } from "./columns";
import { Manager } from "./components/Manager";
import { DataTable } from "./data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconArrowBounce, IconChartLine, IconChartPie, IconCoins, IconWallet } from "@tabler/icons-react";
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
      <div className="p-2 md:p-10 h-auto overflow-y-auto  rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-14 flex-1 w-full ">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between ">
            <h3 className="text-2xl font-bold leading-relaxed">Portfolio</h3>

            <Manager />
          </div>
          <div className=" gap-2 grid grid-cols-1 md:grid-cols-3">
            <Card className="h-40 flex flex-col justify-center gap-6">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-primary">Total Value</CardTitle>
                <IconCoins className="text-green-700  h-5 w-5 flex-shrink-0" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">${10}</div>
                <p className="text-sm text-muted-foreground">Accumulated transactions.</p>
              </CardContent>
            </Card>
            <Card className="h-40 flex flex-col justify-center gap-6">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-primary">Total Asset</CardTitle>
                <IconWallet className="text-orange-700  h-5 w-5 flex-shrink-0" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">${10}</div>
                <p className="text-sm text-muted-foreground">Accumulated transactions.</p>
              </CardContent>
            </Card>
            <Card className="h-40 flex flex-col justify-center gap-6">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-primary">24h Change</CardTitle>
                <IconChartLine className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">${10}</div>
                <p className="text-sm text-muted-foreground">Accumulated transactions.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <DataTable columns={columns} data={data} />
      </div>
      {/* <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        <div className="flex gap-2">
          {[...new Array(4)].map(i => (
            <div
              key={"first-array" + i}
              className="h-20 w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse"
            ></div>
          ))}
        </div>
        <div className="flex gap-2 flex-1">
          {[...new Array(2)].map(i => (
            <div
              key={"second-array" + i}
              className="h-full w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse"
            ></div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default Portfolio;
