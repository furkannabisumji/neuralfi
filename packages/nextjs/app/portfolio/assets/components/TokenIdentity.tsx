import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alchemy, Network } from "alchemy-sdk";

const getTokenMetaData = async (token: string) => {
  if (!token) return null;

  const config = {
    apiKey: "RFQWPxVBq8KY8lRtViUEKhrtffVyfoNq", // Replace with your actual API key
    network: Network.ETH_MAINNET,
  };

  const alchemy = new Alchemy(config);

  try {
    // Fetch metadata from Alchemy
    const { decimals, logo, name, symbol } = await alchemy.core.getTokenMetadata(token);
    return { decimals, logo, name, symbol };
  } catch (error) {
    console.error("Error fetching token metadata:", error);
    return null; // Return null in case of an error
  }
};

interface TokenIdentityProps {
  tokenAddress: string;
}

const TokenIdentity: React.FC<TokenIdentityProps> = ({ tokenAddress }) => {
  const [tokenMetadata, setTokenMetadata] = useState<{
    name: string | null;
    logo: string | null;
    symbol: string | null;
  } | null>(null);

  // Fetch token metadata when the component is mounted or when the tokenAddress changes
  useEffect(() => {
    const fetchMetadata = async () => {
      const data = await getTokenMetaData(tokenAddress);
      setTokenMetadata(data);
    };

    fetchMetadata();
  }, [tokenAddress]); // Dependency on tokenAddress to refetch metadata when it changes

  // If metadata is not available, show a loading state
  if (!tokenMetadata) {
    return <div className="text-center font-medium">Loading...</div>;
  }

  return (
    <div className="text-center font-medium flex items-center gap-2">
      <Avatar>
        <AvatarImage src={tokenMetadata?.logo ?? ""} />
        <AvatarFallback>{tokenMetadata?.symbol ?? "TK"}</AvatarFallback>
      </Avatar>
      {tokenMetadata?.name ?? "Token Name"}
    </div>
  );
};

export default TokenIdentity;
