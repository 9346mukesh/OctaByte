import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.js";
import { PortfolioController } from "./controllers/portfolioController.js";
import { GoogleFinanceMarketDataProvider } from "./providers/googleFinanceProvider.js";
import { YahooFinanceMarketDataProvider } from "./providers/yahooFinanceProvider.js";
import { PortfolioRepository } from "./repositories/portfolioRepository.js";
import { createPortfolioRoutes } from "./routes/portfolioRoutes.js";
import { MarketDataService } from "./services/marketDataService.js";
import { PortfolioService } from "./services/portfolioService.js";





const portfolioRepository =
  new PortfolioRepository();

const yahooFinanceProvider =
  new YahooFinanceMarketDataProvider();

const googleFinanceProvider =
  new GoogleFinanceMarketDataProvider();

const marketDataService =
  new MarketDataService(
    yahooFinanceProvider,
    googleFinanceProvider,
  );

const portfolioService =
  new PortfolioService(
    portfolioRepository,
    marketDataService,
  );

const portfolioController =
  new PortfolioController(
    portfolioService,
  );

const app = express();

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ??
      "http://localhost:3000",
  }),
);

app.use(express.json());

app.get("/health", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "Portfolio API is running",
  });
});

app.use(
  "/api/portfolio",
  createPortfolioRoutes(
    portfolioController,
  ),
);

app.use(errorHandler);

export default app;