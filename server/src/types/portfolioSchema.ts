import { z } from "zod";

export const normalizedHoldingDataSchema =
  z.object({
    id: z.string(),
    stockName: z.string(),
    marketSymbol: z.string(),
    sector: z.string().nullable(),
    exchange: z.enum(["NSE", "BSE"]),
    purchasePrice: z.number(),
    quantity: z.number().positive(),
  });

export const soldHoldingDataSchema =
  normalizedHoldingDataSchema.extend({
    salePrice: z.number().positive(),
  });

export const portfolioDataSchema =
  z.object({
    currentHoldings: z.array(
      normalizedHoldingDataSchema,
    ),
    soldHoldings: z.array(
      soldHoldingDataSchema,
    ),
  });