export async function processWithConcurrency<T, R>(
  items: readonly T[],
  concurrencyLimit: number,
  processor: (item: T) => Promise<R>,
): Promise<PromiseSettledResult<R>[]> {
  if (items.length === 0) {
    return [];
  }

  const results =
    new Array<PromiseSettledResult<R>>(items.length);

  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (true) {
      const currentIndex = nextIndex;
      nextIndex += 1;

      if (currentIndex >= items.length) {
        return;
      }

      try {
        const result = await processor(
          items[currentIndex]!,
        );

        results[currentIndex] = {
          status: "fulfilled",
          value: result,
        };
      } catch (error) {
        results[currentIndex] = {
          status: "rejected",
          reason: error,
        };
      }
    }
  }

  const workerCount = Math.min(
    Math.max(concurrencyLimit, 1),
    items.length,
  );

  await Promise.all(
    Array.from(
      { length: workerCount },
      () => worker(),
    ),
  );

  return results;
}