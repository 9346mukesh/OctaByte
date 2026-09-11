import { useCallback, useEffect, useState } from "react";

import { getPortfolio } from "../lib/api/portfolioApi";
import type { PortfolioData } from "../types/portfolio";

interface UsePortfolioDataResult {
  portfolioData: PortfolioData | null;
  isLoading: boolean;
  isRefreshing: boolean;
  errorMessage: string | null;
  lastUpdated: Date | null;
  refreshPortfolioData: () => void;
}

const portfolioRefreshIntervalMilliseconds = 15_000;

export function usePortfolioData(): UsePortfolioDataResult {
  const [portfolioData, setPortfolioData] =
    useState<PortfolioData | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [lastUpdated, setLastUpdated] =
    useState<Date | null>(null);

  const fetchPortfolioData =
    useCallback(
      async (
        isBackgroundRefresh: boolean,
      ): Promise<void> => {
        if (isBackgroundRefresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        try {
          const portfolio =
            await getPortfolio();

          setPortfolioData(portfolio);
          setLastUpdated(new Date());
          setErrorMessage(null);
        } catch (error: unknown) {
          console.error(
            "Failed to load portfolio data:",
            error,
          );

          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to load portfolio data.",
          );
        } finally {
          if (isBackgroundRefresh) {
            setIsRefreshing(false);
          } else {
            setIsLoading(false);
          }
        }
      },
      [],
    );

  const refreshPortfolioData =
    useCallback((): void => {
      void fetchPortfolioData(true);
    }, [fetchPortfolioData]);

  useEffect(() => {
    let isComponentMounted = true;

    const initialFetchTimeout =
      setTimeout(() => {
        if (!isComponentMounted) {
          return;
        }

        void fetchPortfolioData(false);
      }, 0);

    return () => {
      isComponentMounted = false;
      clearTimeout(initialFetchTimeout);
    };
  }, [fetchPortfolioData]);

  useEffect(() => {
    let isComponentMounted = true;
    let refreshTimeout: ReturnType<
      typeof setTimeout
    >;

    const performScheduledRefresh =
      async (): Promise<void> => {
        if (!isComponentMounted) {
          return;
        }

        await fetchPortfolioData(true);

        if (!isComponentMounted) {
          return;
        }

        refreshTimeout = setTimeout(
          () => {
            void performScheduledRefresh();
          },
          portfolioRefreshIntervalMilliseconds,
        );
      };

    refreshTimeout = setTimeout(
      () => {
        void performScheduledRefresh();
      },
      portfolioRefreshIntervalMilliseconds,
    );

    return () => {
      isComponentMounted = false;
      clearTimeout(refreshTimeout);
    };
  }, [fetchPortfolioData]);

  return {
    portfolioData,
    isLoading,
    isRefreshing,
    errorMessage,
    lastUpdated,
    refreshPortfolioData,
  };
}