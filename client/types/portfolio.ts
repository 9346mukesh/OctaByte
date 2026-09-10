export interface PortfolioHolding {
  id: string;
  stockName: string;
  marketSymbol: string;
  sector: string;
  exchange: "NSE" | "BSE";
  purchasePrice: number;
  quantity: number;
}