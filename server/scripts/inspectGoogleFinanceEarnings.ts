const url =
  "https://www.google.com/finance/quote/HDFCBANK:NSE";

const response = await fetch(
  url,
  {
    signal: AbortSignal.timeout(5000),
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    },
  },
);

if (!response.ok) {
  throw new Error(
    `Google Finance request failed with status ${response.status}`,
  );
}

const html = await response.text();

const searchTerms = [
  "Earnings",
  "Net income",
  "Income statement",
  "Financials",
];

for (const searchTerm of searchTerms) {
  const matchIndex =
    html.toLowerCase().indexOf(
      searchTerm.toLowerCase(),
    );

  console.log(`\n===== ${searchTerm} =====`);

  if (matchIndex === -1) {
    console.log("Not found");
    continue;
  }

  const startIndex =
    Math.max(0, matchIndex - 500);

  const endIndex =
    Math.min(
      html.length,
      matchIndex + 2_000,
    );

  console.log(
    html.slice(startIndex, endIndex),
  );
}