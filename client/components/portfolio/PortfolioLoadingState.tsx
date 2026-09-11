export default function PortfolioLoadingState() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="text-center">
        <div className="inline-flex h-16 w-16 animate-spin rounded-full border-4 border-slate-800 border-t-violet-400" />
        <p className="mt-4 text-lg font-semibold text-white">
          Loading your portfolio...
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Fetching live market data from
          <br />
          Yahoo Finance & Google Finance
        </p>
      </div>
    </main>
  );
}