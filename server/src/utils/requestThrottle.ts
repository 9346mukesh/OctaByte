export class RequestThrottle {
  private queue = Promise.resolve();
  private lastStartedAt = 0;

  constructor(
    private readonly minimumIntervalMilliseconds: number,
  ) {}

  run<T>(operation: () => Promise<T>): Promise<T> {
    const scheduledOperation = this.queue.then(
      async () => {
        const elapsedMilliseconds =
          Date.now() - this.lastStartedAt;
        const waitMilliseconds =
          this.minimumIntervalMilliseconds - elapsedMilliseconds;

        if (waitMilliseconds > 0) {
          await new Promise<void>((resolve) => {
            setTimeout(resolve, waitMilliseconds);
          });
        }

        this.lastStartedAt = Date.now();
        return operation();
      },
    );

    this.queue = scheduledOperation.then(
      () => undefined,
      () => undefined,
    );

    return scheduledOperation;
  }
}
