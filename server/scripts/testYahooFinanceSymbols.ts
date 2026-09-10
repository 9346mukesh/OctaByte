const yahooFinanceSymbols = [
  "ICICIBANK.BO",
  "BAJAJHFL.BO",
  "SAVFI.BO",
  "KPITTECH.BO",
  "TATATECH.BO",
  "BLSE.BO",
  "TANLA.BO",
  "TATACONSUM.BO",
  "PIDILITIND.BO",
  "TATAPOWER.BO",
  "KPIGREEN.BO",
  "SUZLON.BO",
  "GENSOL.BO",
  "HARIOMPIPE.BO",
  "POLYCAB.BO",
  "CLEAN.BO",
  "DEEPAKNTR.BO",
  "FINEORG.BO",
  "GRAVITA.BO",
  "SBILIFE.BO",
];

interface YahooFinanceChartResponse {
  chart: {
    result: Array<{
      meta: {
        symbol?: string;
        exchangeName?: string;
        longName?: string;
        shortName?: string;
        regularMarketPrice?: number;
      };
    }> | null;
    error: unknown;
  };
}

async function testYahooFinanceSymbol(
  yahooFinanceSymbol: string,
): Promise<void> {
  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/` +
    `${encodeURIComponent(yahooFinanceSymbol)}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.log(
        `FAILED ${yahooFinanceSymbol} - HTTP ${response.status}`,
      );
      return;
    }

    const data =
      (await response.json()) as YahooFinanceChartResponse;

    const metadata = data.chart.result?.[0]?.meta;

    if (!metadata) {
      console.log(`FAILED ${yahooFinanceSymbol} - No metadata`);
      return;
    }

    console.log({
      requestedSymbol: yahooFinanceSymbol,
      yahooSymbol: metadata.symbol,
      exchange: metadata.exchangeName,
      companyName:
        metadata.longName ?? metadata.shortName,
      currentMarketPrice:
        metadata.regularMarketPrice,
    });
  } catch (error) {
    console.log(
      `FAILED ${yahooFinanceSymbol}`,
      error,
    );
  }
}

for (const yahooFinanceSymbol of yahooFinanceSymbols) {
  await testYahooFinanceSymbol(yahooFinanceSymbol);
}