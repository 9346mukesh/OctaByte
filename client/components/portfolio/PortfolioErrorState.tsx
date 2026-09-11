interface PortfolioErrorStateProperties {
  errorMessage: string;
  onRetry: () => void;
}

export default function PortfolioErrorState({
  errorMessage,
  onRetry,
}: PortfolioErrorStateProperties) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5">
      <div className="max-w-md text-center">
        <div className="mb-4 text-5xl">⚠️</div>
        <h1 className="text-2xl font-bold text-white">
          Unable to Load Portfolio
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          {errorMessage}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-xl bg-violet-400 px-6 py-2 font-medium text-slate-950 hover:bg-violet-300"
        >
          Try Again
        </button>

        <p className="mt-4 text-xs text-slate-500">
          If the problem persists, please check
          your internet connection or try again
          later.
        </p>
      </div>
    </main>
  );
}