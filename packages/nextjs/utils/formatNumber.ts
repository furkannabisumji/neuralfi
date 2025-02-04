// utils/formatNumber.ts

export const formatNumber = (num: number): string => {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1) + "B"; // Billion
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M"; // Million
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + "K"; // Thousand
  } else {
    return num.toFixed(0); // No abbreviation for values less than 1000
  }
};
