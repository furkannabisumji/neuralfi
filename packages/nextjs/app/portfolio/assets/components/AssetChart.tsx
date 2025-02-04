"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Alchemy, Network } from "alchemy-sdk";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

// Define the token metadata type
type TokenMetadata = {
  decimals: number;
  logo: string;
  name: string;
  symbol: string;
} | null;

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function AssetChart({ token, color }: { token: string; color: string }) {
  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata>(null);

  const getTokenMetaData = async () => {
    if (!token) return;
    const config = {
      apiKey: "RFQWPxVBq8KY8lRtViUEKhrtffVyfoNq",
      network: Network.ETH_MAINNET,
    };
    const alchemy = new Alchemy(config);

    // The token token we want to query for metadata
    const { decimals, logo, name, symbol } = await alchemy.core.getTokenMetadata(token);
    setTokenMetadata({
      decimals,
      logo,
      name,
      symbol,
    });
  };

  useEffect(() => {
    getTokenMetaData();
  }, [token]);

  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle className="flex gap-2  items-center">
          <Avatar>
            <AvatarImage src={tokenMetadata?.logo ?? ""} />
            <AvatarFallback>{tokenMetadata?.symbol ?? "TK"}</AvatarFallback>
          </Avatar>

          {tokenMetadata?.name ?? ""}
        </CardTitle>
        {/* <CardDescription>Showing total visitors for the last 6 months</CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[100px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            {/* <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={value => value.slice(0, 3)}
            /> */}
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Area dataKey="desktop" type="natural" fill={color} fillOpacity={0.4} stroke={color} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">January - June 2024</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
