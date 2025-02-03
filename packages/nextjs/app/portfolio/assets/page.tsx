import { PortfolioMetrics, columns } from "./columns";
// import { AssetChart } from "./components/AssetChart";
import AssetChartCarousel from "./components/AssetChartCarousel";
import { DataTable } from "./data-table";
import { NextPage } from "next";

async function getData(): Promise<PortfolioMetrics[]> {
  // Fetch data from your API here.
  return [
    {
      id: "token1",
      address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE", // SHIB
      currentPrice: 0.000015,
      priceChange24h: 5.24,
      portfolioWeight: 3.75,
      marketCap: 60200000000,
      maxDrawdown: -63.42,
      sharpeRatio: 1.4,
    },
    {
      id: "token2",
      address: "0x514910771AF9Ca656af840dff83E8264EcF986CA", // LINK
      currentPrice: 25.11,
      priceChange24h: -2.56,
      portfolioWeight: 6.42,
      marketCap: 11500000000,
      maxDrawdown: -45.12,
      sharpeRatio: 1.35,
    },
    {
      id: "token3",
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", // WBTC
      currentPrice: 22730.56,
      priceChange24h: 2.58,
      portfolioWeight: 10.87,
      marketCap: 168000000000,
      maxDrawdown: -30.55,
      sharpeRatio: 2.0,
    },
    {
      id: "token4",
      address: "0xD533a949740bb3306d119CC777fa900bA034cd52", // CRV
      currentPrice: 4.02,
      priceChange24h: 0.78,
      portfolioWeight: 7.91,
      marketCap: 8450000000,
      maxDrawdown: -27.8,
      sharpeRatio: 1.6,
    },
    {
      id: "token5",
      address: "0x111111111117dC0aa78b770fA6A738034120C302", // 1INCH
      currentPrice: 2.5,
      priceChange24h: -3.21,
      portfolioWeight: 4.15,
      marketCap: 1500000000,
      maxDrawdown: -42.56,
      sharpeRatio: 1.2,
    },
    {
      id: "token6",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
      currentPrice: 1.0,
      priceChange24h: 0.0,
      portfolioWeight: 18.2,
      marketCap: 72000000000,
      maxDrawdown: -0.5,
      sharpeRatio: 0.9,
    },
    {
      id: "token7",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
      currentPrice: 1.0,
      priceChange24h: -0.05,
      portfolioWeight: 9.45,
      marketCap: 48000000000,
      maxDrawdown: -0.7,
      sharpeRatio: 1.1,
    },
    {
      id: "token8",
      address: "0x408e41876cCCDC0F92210600ef50372656052a38", // REN
      currentPrice: 0.5,
      priceChange24h: 6.11,
      portfolioWeight: 2.3,
      marketCap: 2000000000,
      maxDrawdown: -55.43,
      sharpeRatio: 1.6,
    },
    {
      id: "token9",
      address: "0x853d955aCEf822Db058eb8505911ED77F175b99e", // FRAX
      currentPrice: 1.0,
      priceChange24h: -0.12,
      portfolioWeight: 5.6,
      marketCap: 3500000000,
      maxDrawdown: -1.2,
      sharpeRatio: 1.9,
    },
    {
      id: "token10",
      address: "0x7d1AFA7B718fb893dB30A3aBc0Cfc608aACfeBB0", // MATIC
      currentPrice: 1.5,
      priceChange24h: 1.68,
      portfolioWeight: 8.9,
      marketCap: 11500000000,
      maxDrawdown: -23.56,
      sharpeRatio: 1.8,
    },
    {
      id: "token11",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
      currentPrice: 1.0,
      priceChange24h: 0.02,
      portfolioWeight: 12.34,
      marketCap: 69000000000,
      maxDrawdown: -0.4,
      sharpeRatio: 1.0,
    },
    {
      id: "token12",
      address: "0xC02aaa39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
      currentPrice: 2110.35,
      priceChange24h: 1.45,
      portfolioWeight: 15.32,
      marketCap: 120000000000,
      maxDrawdown: -17.3,
      sharpeRatio: 1.5,
    },
    {
      id: "token13",
      address: "0x72e364F2ABdC788b7E918bc238B21f109Cd634D7", // MVI
      currentPrice: 3000.1,
      priceChange24h: -2.34,
      portfolioWeight: 10.5,
      marketCap: 2000000000,
      maxDrawdown: -33.21,
      sharpeRatio: 0.95,
    },
    {
      id: "token14",
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", // WBTC
      currentPrice: 23490.75,
      priceChange24h: 3.12,
      portfolioWeight: 13.14,
      marketCap: 87000000000,
      maxDrawdown: -21.32,
      sharpeRatio: 2.1,
    },
    {
      id: "token15",
      address: "0x111111111117dC0aa78b770fA6A738034120C302", // 1INCH
      currentPrice: 3.0,
      priceChange24h: 1.23,
      portfolioWeight: 6.99,
      marketCap: 5000000000,
      maxDrawdown: -25.48,
      sharpeRatio: 1.3,
    },
    {
      id: "token16",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
      currentPrice: 1.0,
      priceChange24h: 0.01,
      portfolioWeight: 20.28,
      marketCap: 55000000000,
      maxDrawdown: -0.2,
      sharpeRatio: 1.0,
    },
    {
      id: "token17",
      address: "0x7d1AFA7B718fb893dB30A3aBc0Cfc608aACfeBB0", // MATIC
      currentPrice: 2.1,
      priceChange24h: 2.98,
      portfolioWeight: 8.32,
      marketCap: 9500000000,
      maxDrawdown: -5.78,
      sharpeRatio: 2.3,
    },
    {
      id: "token18",
      address: "0xD533a949740bb3306d119CC777fa900bA034cd52", // CRV
      currentPrice: 4.65,
      priceChange24h: -1.56,
      portfolioWeight: 7.7,
      marketCap: 22000000000,
      maxDrawdown: -19.34,
      sharpeRatio: 1.8,
    },
    {
      id: "token19",
      address: "0x514910771AF9Ca656af840dff83E8264EcF986CA", // LINK
      currentPrice: 30.12,
      priceChange24h: 1.12,
      portfolioWeight: 5.9,
      marketCap: 6500000000,
      maxDrawdown: -9.56,
      sharpeRatio: 1.7,
    },
    {
      id: "token20",
      address: "0x0D8775F648430679A709E98d2b0Cb6250d2887EF", // BAT
      currentPrice: 0.75,
      priceChange24h: 0.92,
      portfolioWeight: 4.78,
      marketCap: 5000000000,
      maxDrawdown: -29.82,
      sharpeRatio: 1.0,
    },
  ];
}

const chartColors = [
  "#4F46E5", // Indigo
  "#10B981", // Emerald Green
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#6366F1", // Blue-Violet
  "#14B8A6", // Teal
  "#F43F5E", // Rose Red
  "#3B82F6", // Blue
];

const tokens = [
  "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT (Tether)
  "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI (Dai Stablecoin)
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC (USD Coin)
  "0xC02aaa39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH (Wrapped Ethereum)
  "0x111111111117dC0aa78b770fA6A738034120C302", // 1INCH (1inch)
  "0x514910771AF9Ca656af840dff83E8264EcF986CA", // LINK (Chainlink)
  "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE", // SHIB (Shiba Inu)
  "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", // WBTC (Wrapped Bitcoin)
  "0x7d1AFA7B718fb893dB30A3aBc0Cfc608aACfeBB0", // MATIC (Polygon)
  "0xD533a949740bb3306d119CC777fa900bA034cd52", // CRV (Curve)
  "0x853d955aCEf822Db058eb8505911ED77F175b99e", // FRAX (Frax)
  "0x0D8775F648430679A709E98d2b0Cb6250d2887EF", // BAT (Basic Attention Token)
  "0x408e41876cCCDC0F92210600ef50372656052a38", // REN (Ren Protocol)
  "0xc944E90C64B2c07662A292be6244BDf05Cda44a7", // GRT (The Graph)
  "0x72e364F2ABdC788b7E918bc238B21f109Cd634D7", // MVI (Metaverse Index)
];

const Assets: NextPage = async () => {
  const data = await getData();

  return (
    <div className="flex h-full w-full overflow-y-auto ">
      <div className="p-2 md:p-10 h-auto overflow-y-auto  rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-20 flex-1 w-full ">
        <div className="flex flex-col gap-3">
          <h3 className="text-2xl font-bold leading-relaxed">Assets</h3>
          <div className="bg-neutral-100 dark:bg-neutral-800 py-3 px-2">
            <AssetChartCarousel tokens={tokens} chartColors={chartColors} />
          </div>
        </div>

        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Assets;
