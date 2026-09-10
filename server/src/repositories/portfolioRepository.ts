import fs from "node:fs/promises";

import { portfolioDataFilePath } from "../config/paths.js";
import {
  PortfolioData,
} from "../types/portfolio.js";

export class PortfolioRepository {
  async getPortfolioData(): Promise<PortfolioData> {
    const fileContent = await fs.readFile(
      portfolioDataFilePath,
      "utf8",
    );

    return JSON.parse(fileContent) as PortfolioData;
  }
}