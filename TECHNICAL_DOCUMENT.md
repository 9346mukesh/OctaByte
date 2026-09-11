# Technical Document

## Overview

The dashboard uses a Next.js frontend and an Express.js backend.

The backend reads the portfolio data from the local JSON file, gets the latest market information from external providers, calculates the required portfolio metrics, and sends the processed data to the frontend.

The frontend then displays the portfolio and automatically refreshes the data periodically so that users can see updated market information without manually refreshing the page.

---

# Challenge 1: Parallel API Requests

Each holding may need data from different external providers. For example, the current market price comes from Yahoo Finance, while fundamental data such as P/E ratio and earnings comes from Google Finance.

If we request the data for every holding one by one, the API response can become slow as the number of holdings increases.

However, sending requests for all holdings at the same time is also not a good approach because it can create too many requests and increase the chances of hitting provider limits.

## Solution

To handle this, the backend uses a bounded-concurrency worker queue through `processWithConcurrency`.

Only a limited number of holdings are processed at the same time. This allows multiple holdings to be handled in parallel while keeping the number of active operations under control.

For each holding, the market data service requests the price and fundamental data independently. These requests are started together using `Promise.allSettled`.

This helps reduce the total waiting time because one request does not have to wait for the other to finish.

It also helps with partial failures.

For example, if Yahoo Finance successfully returns the CMP but Google Finance fails to return the P/E ratio, the entire portfolio request does not fail. The CMP is still returned, while the P/E ratio is marked as unavailable.

On the frontend, `async`/`await` is used for the API request. Separate loading and refreshing states are maintained so that the initial page load can show a loading state, while background refreshes can happen without replacing the entire dashboard with a loading screen.

---

# Challenge 2: Rate Limiting Public Sources

The application uses public market-data sources, so we cannot assume that they will accept unlimited requests.

This becomes more important because the dashboard automatically refreshes the portfolio. Without any controls, repeated refreshes could generate many requests for the same stocks and potentially result in rate limiting.

## Solution

The backend uses multiple mechanisms to control the number of requests:

- `RequestThrottle` serializes requests for each provider and maintains a minimum interval between request starts.
- `processWithConcurrency` limits the number of holdings processed at the same time.
- Market prices are cached in memory for 15 seconds.
- Fundamental data is cached for 2 minutes because it changes less frequently.
- Cache keys contain both the exchange and market symbol so that data from one market is not accidentally returned for another.
- `Promise.allSettled` keeps provider failures isolated so that one failed request does not cause the entire portfolio request to fail.

Together, these mechanisms reduce unnecessary requests and help keep the dashboard usable even when an external provider is temporarily unavailable.

The current cache is stored in the backend process memory. This is suitable for local development and a single API instance.

If the application is deployed using multiple backend instances, a shared cache such as Redis would be a better option so that all instances can share the same cached data.

---

# Challenge 3: Performance Optimization

As the portfolio refreshes every 15 seconds, the application needs to stay responsive while handling multiple holdings and external API requests.

The main challenge was to avoid making unnecessary API calls and unnecessary React re-renders while still keeping the market data reasonably fresh.

## Solution

We handled the performance mainly through caching, controlled refreshes, and selective React memoization.

### Caching

The backend keeps market data in an in-memory cache with different expiry times:

- **CMP:** 15 seconds
- **Fundamental data:** 2 minutes

CMP is refreshed more frequently because market prices can change often, while fundamental data such as P/E and earnings does not need to be requested every few seconds.

This reduces repeated requests to Yahoo Finance and Google Finance while still keeping the data reasonably fresh.

### Controlled Refresh

The frontend automatically refreshes the portfolio approximately every 15 seconds.

Instead of continuously sending requests, the next refresh is scheduled after the previous refresh is completed. This helps prevent multiple portfolio requests from running at the same time, especially when an external provider takes longer to respond.

Users can also manually refresh the portfolio when needed.

### React Memoization

The portfolio contains multiple table rows, so re-rendering every row unnecessarily can add extra work during each refresh.

`PortfolioTableRow` uses `React.memo` so that a row can skip rendering when its properties have not changed.

The data hook also uses `useCallback` for the fetch and refresh functions. This keeps the function references stable when their dependencies have not changed and helps prevent unnecessary effect re-runs. React recommends using `memo` and `useCallback` selectively when they provide a real performance benefit.

Overall, the goal was not to optimize every part of the application, but to focus on the areas that are actually affected by the dashboard's frequent data refreshes.

---
## Overall Approach

The application focuses on keeping the portfolio dashboard **fast, reliable, and easy to maintain**.

The backend handles portfolio data, market-data integration, calculations, caching, throttling, and error handling, while the frontend handles the dashboard UI and automatic refreshes.

The main approach is:

- **Parallel processing** for faster API responses
- **Concurrency control and throttling** to avoid excessive external requests
- **Caching** to reduce repeated API calls
- **Automatic 15-second refresh** to keep data updated
- **Error isolation** so one provider failure does not break the dashboard
- **React memoization** to reduce unnecessary UI re-renders

This provides a good balance between **performance, reliability, data freshness, and maintainable code**.


---