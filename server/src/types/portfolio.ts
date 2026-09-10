export interface NormalizedHoldingData {
  id: string;
  stockName: string;
  marketSymbol: string;
  sector: string | null;
  exchange: "NSE" | "BSE";
  purchasePrice: number;
  quantity: number;
}

export interface SoldHoldingData
  extends NormalizedHoldingData {
  salePrice: number;
}

export interface PortfolioData {
  currentHoldings: NormalizedHoldingData[];
  soldHoldings: SoldHoldingData[];
}