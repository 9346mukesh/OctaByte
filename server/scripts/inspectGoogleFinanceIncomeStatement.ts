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

const incomeStatementIndex =
  html.indexOf("Income statement");

if (incomeStatementIndex === -1) {
  console.log(
    "Income statement was not found.",
  );
  process.exit(0);
}

const startIndex =
  Math.max(
    0,
    incomeStatementIndex - 1_000,
  );

const endIndex =
  Math.min(
    html.length,
    incomeStatementIndex + 15_000,
  );

console.log(
  html.slice(startIndex, endIndex),
);