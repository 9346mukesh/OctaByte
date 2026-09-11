export default function PortfolioEmptyState() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="text-center">
        <div className="mb-4 text-5xl">📊</div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          No Holdings Found
        </h1>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Your portfolio appears to be empty.
          <br />
          Add some stocks to get started!
        </p>
      </div>
    </main>
  );
}