const yahooFinanceSymbolByMarketSymbol: Record<
  string,
  string
> = {
  "532174": "ICICIBANK.BO",
  "544252": "BAJAJHFL.BO",
  "511577": "MANTRA.BO",
  "542651": "KPITTECH.BO",
  "544028": "TATATECH.BO",
  "544107": "BLSE.BO",
  "532790": "TANLA.BO",
  "532540": "TATACONSUM.BO",
  "500331": "PIDILITIND.BO",
  "500400": "TATAPOWER.BO",
  "542323": "KPIGREEN.BO",
  "532667": "SUZLON.BO",
  "542851": "GENSOL.BO",
  "543517": "HARIOMPIPE.BO",
  "542652": "POLYCAB.BO",
  "543318": "CLEAN.BO",
  "506401": "DEEPAKNTR.BO",
  "541557": "FINEORG.BO",
  "533282": "GRAVITA.BO",
  "540719": "SBILIFE.BO",
};

const yahooFinanceNseSymbolByMarketSymbol: Record<
  string,
  string
> = {
  LTIM: "LTM.NS",
};

export function resolveYahooFinanceSymbol(
  marketSymbol: string,
  exchange: "NSE" | "BSE",
): string | null {
  if (exchange === "NSE") {
    return (
      yahooFinanceNseSymbolByMarketSymbol[
        marketSymbol
      ] ?? `${marketSymbol}.NS`
    );
  }

  return (
    yahooFinanceSymbolByMarketSymbol[
      marketSymbol
    ] ?? null
  );
}