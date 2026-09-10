import fs from "node:fs";
import path from "node:path";
import XLSX from "xlsx";

type HoldingStatus = "CURRENT" | "SOLD";

interface NormalizedHoldingData {
  id: string;
  stockName: string;
  marketSymbol: string;
  sector: string | null;
  exchange: "NSE" | "BSE";
  purchasePrice: number;
  quantity: number;
}

interface ParsedHoldingData extends NormalizedHoldingData {
  holdingStatus: HoldingStatus;
  salePrice: number | null;
}

interface PortfolioData {
  currentHoldings: NormalizedHoldingData[];
  soldHoldings: (NormalizedHoldingData & {
    salePrice: number;
  })[];
}

interface ParsedPortfolioData {
  currentHoldings: ParsedHoldingData[];
  soldHoldings: ParsedHoldingData[];
}

const inputFilePath = path.resolve(
  "data/input/portfolio.xlsx",
);

const outputFilePath = path.resolve(
  "data/portfolio.json",
);

const worksheetName = "Priyanshu";

function isNumber(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

function isEmpty(value: unknown): boolean {
  return (
    value === undefined ||
    value === null ||
    value === ""
  );
}

function getCellValue(
  worksheet: XLSX.WorkSheet,
  column: string,
  rowNumber: number,
): unknown {
  const cellAddress = `${column}${rowNumber}`;
  const cell = worksheet[cellAddress];

  return cell?.v;
}

function normalizeMarketInformation(
  marketValue: unknown,
): {
  marketSymbol: string;
  exchange: "NSE" | "BSE";
} {
  if (
    typeof marketValue === "string" &&
    marketValue.trim() !== ""
  ) {
    return {
      marketSymbol: marketValue.trim(),
      exchange: "NSE",
    };
  }

  if (isNumber(marketValue)) {
    return {
      marketSymbol: String(marketValue),
      exchange: "BSE",
    };
  }

  throw new Error(
    "Market symbol/exchange value is missing.",
  );
}

function determineHoldingStatus(
  salePriceValue: unknown,
): {
  holdingStatus: HoldingStatus;
  salePrice: number | null;
} {
  /*
   * Current holdings have an empty Sale Price cell.
   */
  if (isEmpty(salePriceValue)) {
    return {
      holdingStatus: "CURRENT",
      salePrice: null,
    };
  }

  /*
   * Sold holdings must have a positive Sale Price.
   */
  if (
    isNumber(salePriceValue) &&
    salePriceValue > 0
  ) {
    return {
      holdingStatus: "SOLD",
      salePrice: salePriceValue,
    };
  }

  throw new Error(
    `Invalid sale price value: ${String(salePriceValue)}.`,
  );
}

function isHoldingRow(
  worksheet: XLSX.WorkSheet,
  rowNumber: number,
): boolean {
  /*
   * Read the important cells directly from Excel
   * rather than relying on array indexes.
   *
   * A = No
   * B = Particulars
   * C = Purchase Price
   * D = Qty
   */
  const stockName = getCellValue(
    worksheet,
    "B",
    rowNumber,
  );

  const purchasePrice = getCellValue(
    worksheet,
    "C",
    rowNumber,
  );

  const quantity = getCellValue(
    worksheet,
    "D",
    rowNumber,
  );

  return (
    typeof stockName === "string" &&
    stockName.trim() !== "" &&
    isNumber(purchasePrice) &&
    isNumber(quantity) &&
    quantity > 0
  );
}

function isSectorRow(
  worksheet: XLSX.WorkSheet,
  rowNumber: number,
): boolean {
  const sectorValue = getCellValue(
    worksheet,
    "B",
    rowNumber,
  );

  if (typeof sectorValue !== "string") {
    return false;
  }

  const normalizedSector =
    sectorValue.trim().toLowerCase();

  const sectorNames = [
    "financial sector",
    "tech sector",
    "consumer",
    "power",
    "pipe sector",
    "others",
  ];

  return sectorNames.includes(normalizedSector);
}

function isGrandTotalRow(
  worksheet: XLSX.WorkSheet,
  rowNumber: number,
): boolean {
  const particularsValue = getCellValue(
    worksheet,
    "B",
    rowNumber,
  );

  if (typeof particularsValue !== "string") {
    return false;
  }

  return (
    particularsValue.trim().toLowerCase() ===
    "grand total"
  );
}

function isSoldSectionMarker(
  worksheet: XLSX.WorkSheet,
  rowNumber: number,
): boolean {
  const salePriceValue = getCellValue(
    worksheet,
    "AG",
    rowNumber,
  );

  /*
   * The sold section contains the "Sold Price"
   * marker in the Stage-2/Sale Price area.
   */
  return salePriceValue === "Sold Price";
}

function createHolding(
  worksheet: XLSX.WorkSheet,
  rowNumber: number,
  currentSector: string | null,
  isSoldSection: boolean,
  holdingNumber: number,
): ParsedHoldingData {
  const stockName = String(
    getCellValue(
      worksheet,
      "B",
      rowNumber,
    ),
  ).trim();

  const purchasePrice = getCellValue(
    worksheet,
    "C",
    rowNumber,
  );

  const quantity = getCellValue(
    worksheet,
    "D",
    rowNumber,
  );

  const marketValue = getCellValue(
    worksheet,
    "G",
    rowNumber,
  );

  /*
   * AG contains the sale price only in the sold
   * section. Current rows use it for stage status.
   */
  const salePriceValue = isSoldSection
    ? getCellValue(worksheet, "AG", rowNumber)
    : undefined;

  if (!isNumber(purchasePrice)) {
    throw new Error(
      `Invalid purchase price for "${stockName}" at row ${rowNumber}.`,
    );
  }

  if (
    !isNumber(quantity) ||
    quantity <= 0
  ) {
    throw new Error(
      `Invalid quantity for "${stockName}" at row ${rowNumber}.`,
    );
  }

  const marketInformation =
    normalizeMarketInformation(
      marketValue,
    );

  const holdingStatusInformation =
    determineHoldingStatus(
      salePriceValue,
    );

  return {
    id: `holding-${holdingNumber}`,
    stockName,
    marketSymbol:
      marketInformation.marketSymbol,
    sector: currentSector,
    exchange:
      marketInformation.exchange,
    purchasePrice,
    quantity,
    holdingStatus:
      holdingStatusInformation.holdingStatus,
    salePrice:
      holdingStatusInformation.salePrice,
  };
}

function convertWorkbook(): ParsedPortfolioData {
  console.log(
    "Reading Excel workbook...",
  );

  const workbook = XLSX.readFile(
    inputFilePath,
  );

  console.log(
    "Available worksheets:",
    workbook.SheetNames,
  );

  const worksheet =
    workbook.Sheets[worksheetName];

  if (!worksheet) {
    throw new Error(
      `Worksheet "${worksheetName}" was not found.`,
    );
  }

  const range = XLSX.utils.decode_range(
    worksheet["!ref"] ?? "A1:A1",
  );

  console.log(
    `Total worksheet rows: ${
      range.e.r + 1
    }`,
  );

  const currentHoldings: ParsedHoldingData[] =
    [];

  const soldHoldings: ParsedHoldingData[] =
    [];

  let currentSector: string | null = null;
  let isSoldSection = false;
  let holdingNumber = 1;

  /*
   * Excel rows are 1-based.
   *
   * Row 1 = group headings
   * Row 2 = column headings
   * Row 3 onwards = portfolio data
   */
  for (
    let rowNumber = 3;
    rowNumber <= range.e.r + 1;
    rowNumber += 1
  ) {
    /*
     * Detect the beginning of the sold section.
     *
     * After this point, there is no current sector
     * associated with the sold holdings.
     */
    if (
      isSoldSectionMarker(
        worksheet,
        rowNumber,
      )
    ) {
      currentSector = null;
      isSoldSection = true;
      continue;
    }

    /*
     * Grand Total marks the end of the current
     * holdings section, but we MUST continue because
     * sold holdings appear after it.
     */
    if (
      isGrandTotalRow(
        worksheet,
        rowNumber,
      )
    ) {
      currentSector = null;
      continue;
    }

    /*
     * Update sector for current holdings.
     */
    if (
      isSectorRow(
        worksheet,
        rowNumber,
      )
    ) {
      currentSector = String(
        getCellValue(
          worksheet,
          "B",
          rowNumber,
        ),
      ).trim();

      continue;
    }

    /*
     * Ignore blank rows, summary rows and headings.
     */
    if (
      !isHoldingRow(
        worksheet,
        rowNumber,
      )
    ) {
      continue;
    }

    const holding = createHolding(
      worksheet,
      rowNumber,
      currentSector,
      isSoldSection,
      holdingNumber,
    );

    holdingNumber += 1;

    if (
      holding.holdingStatus ===
      "CURRENT"
    ) {
      currentHoldings.push(
        holding,
      );
    } else {
      soldHoldings.push(
        holding,
      );
    }
  }

  return {
    currentHoldings,
    soldHoldings,
  };
}

function normalizePortfolioData(
  portfolioData: ParsedPortfolioData,
): PortfolioData {
  return {
    currentHoldings:
      portfolioData.currentHoldings.map(
        ({
          id,
          stockName,
          marketSymbol,
          sector,
          exchange,
          purchasePrice,
          quantity,
        }) => ({
          id,
          stockName,
          marketSymbol,
          sector,
          exchange,
          purchasePrice,
          quantity,
        }),
      ),
    soldHoldings:
      portfolioData.soldHoldings.map(
        ({
          id,
          stockName,
          marketSymbol,
          sector,
          exchange,
          purchasePrice,
          quantity,
          salePrice,
        }) => {
          if (salePrice === null) {
            throw new Error(
              `Sold holding "${stockName}" is missing a sale price.`,
            );
          }

          return {
            id,
            stockName,
            marketSymbol,
            sector,
            exchange,
            purchasePrice,
            quantity,
            salePrice,
          };
        },
      ),
  };
}

function validatePortfolioData(
  portfolioData: ParsedPortfolioData,
): void {
  const allHoldings = [
    ...portfolioData.currentHoldings,
    ...portfolioData.soldHoldings,
  ];

  /*
   * Expected source data:
   *
   * Current = 26
   * Sold = 3
   * Total = 29
   */
  if (allHoldings.length !== 29) {
    throw new Error(
      `Expected 29 holdings, but found ${allHoldings.length}.`,
    );
  }

  if (
    portfolioData.currentHoldings.length !==
    26
  ) {
    throw new Error(
      `Expected 26 current holdings, but found ${portfolioData.currentHoldings.length}.`,
    );
  }

  if (
    portfolioData.soldHoldings.length !==
    3
  ) {
    throw new Error(
      `Expected 3 sold holdings, but found ${portfolioData.soldHoldings.length}.`,
    );
  }

  /*
   * Validate current holdings.
   */
  for (
    const holding of
      portfolioData.currentHoldings
  ) {
    if (
      holding.holdingStatus !==
      "CURRENT"
    ) {
      throw new Error(
        `Holding "${holding.stockName}" is incorrectly classified as current.`,
      );
    }

    if (
      holding.salePrice !== null
    ) {
      throw new Error(
        `Current holding "${holding.stockName}" must not have a sale price.`,
      );
    }

    if (
      holding.sector === null
    ) {
      throw new Error(
        `Current holding "${holding.stockName}" must have a sector.`,
      );
    }
  }

  /*
   * Validate sold holdings.
   */
  for (
    const holding of
      portfolioData.soldHoldings
  ) {
    if (
      holding.holdingStatus !==
      "SOLD"
    ) {
      throw new Error(
        `Holding "${holding.stockName}" is incorrectly classified as sold.`,
      );
    }

    if (
      holding.salePrice === null ||
      holding.salePrice <= 0
    ) {
      throw new Error(
        `Sold holding "${holding.stockName}" must have a positive sale price.`,
      );
    }
  }

  /*
   * Validate holding IDs.
   */
  const holdingIds =
    allHoldings.map(
      (holding) => holding.id,
    );

  const uniqueHoldingIds =
    new Set(holdingIds);

  if (
    uniqueHoldingIds.size !==
    holdingIds.length
  ) {
    throw new Error(
      "Duplicate holding IDs were found.",
    );
  }

  /*
   * Validate the known sold prices from
   * the source workbook.
   */
  const expectedSoldPrices =
    new Map<string, number>([
      ["Infy", 1920],
      ["Happeist Mind", 716],
      ["Easemytrip", 15.5],
    ]);

  for (
    const holding of
      portfolioData.soldHoldings
  ) {
    const expectedSalePrice =
      expectedSoldPrices.get(
        holding.stockName,
      );

    if (
      expectedSalePrice !==
      undefined &&
      holding.salePrice !==
        expectedSalePrice
    ) {
      throw new Error(
        `Unexpected sale price for "${holding.stockName}". Expected ${expectedSalePrice}, found ${holding.salePrice}.`,
      );
    }
  }
}

function writePortfolioData(
  portfolioData: PortfolioData,
): void {
  const outputDirectory =
    path.dirname(
      outputFilePath,
    );

  fs.mkdirSync(
    outputDirectory,
    {
      recursive: true,
    },
  );

  fs.writeFileSync(
    outputFilePath,
    JSON.stringify(
      portfolioData,
      null,
      2,
    ),
    "utf8",
  );
}

try {
  const parsedPortfolioData =
    convertWorkbook();

  validatePortfolioData(
    parsedPortfolioData,
  );

  const portfolioData = normalizePortfolioData(
    parsedPortfolioData,
  );

  writePortfolioData(
    portfolioData,
  );

  console.log("");

  console.log(
    "Portfolio conversion completed successfully.",
  );

  console.log(
    `Current holdings: ${portfolioData.currentHoldings.length}`,
  );

  console.log(
    `Sold holdings: ${portfolioData.soldHoldings.length}`,
  );

  console.log(
    `Total holdings: ${
      portfolioData.currentHoldings.length +
      portfolioData.soldHoldings.length
    }`,
  );

  console.log("");

  console.log(
    "Sold holdings:",
  );

  for (
    const holding of
      portfolioData.soldHoldings
  ) {
    console.log(
      `  ${holding.stockName}: ${holding.salePrice}`,
    );
  }

  console.log("");

  console.log(
    `Output: ${outputFilePath}`,
  );
} catch (error) {
  console.error("");

  console.error(
    "Portfolio conversion failed.",
  );

  if (
    error instanceof Error
  ) {
    console.error(
      error.message,
    );
  } else {
    console.error(error);
  }

  process.exit(1);
}