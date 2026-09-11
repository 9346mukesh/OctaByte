import type { ApiResponse } from "../../types/api";
import type { PortfolioData } from "../../types/portfolio";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:4000";

export async function getPortfolio(): Promise<PortfolioData> {
  let response: Response;

  try {
    response = await fetch(
      `${apiBaseUrl}/api/portfolio`,
    );
  } catch {
    throw new Error(
      "Portfolio service is unavailable. Please try again.",
    );
  }

  if (!response.ok) {
    throw new Error(
      "Unable to load portfolio data.",
    );
  }

  let payload: ApiResponse<PortfolioData>;

  try {
    payload =
      (await response.json()) as ApiResponse<PortfolioData>;
  } catch {
    throw new Error(
      "Portfolio service returned an invalid response.",
    );
  }

  if (!payload.success || payload.data === undefined) {
    throw new Error(
      payload.error?.message ??
        "Unable to load portfolio data.",
    );
  }

  return payload.data;
}