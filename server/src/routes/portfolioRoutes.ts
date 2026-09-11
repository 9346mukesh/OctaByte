import { Router } from "express";
import type { PortfolioController } from "../controllers/portfolioController.js";

export function createPortfolioRoutes(
  portfolioController: PortfolioController,
): Router {
  const router = Router();

  router.get(
    "/",
    portfolioController.getPortfolio.bind(
      portfolioController,
    ),
  );

  return router;
}