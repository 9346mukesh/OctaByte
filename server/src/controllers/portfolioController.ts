import type { Request, Response } from "express";
import type { PortfolioService } from "../services/portfolioService.js";

export class PortfolioController {
  constructor(
    private readonly portfolioService: PortfolioService,
  ) {}

  async getPortfolio(
    _request: Request,
    response: Response,
  ): Promise<void> {
    const portfolio =
      await this.portfolioService.getPortfolio();

    response.status(200).json({
      success: true,
      data: portfolio,
    });
  }
}