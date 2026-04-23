export class CircuitBreaker {
  private failures = 0;
  private lastFailureAt = 0;
  private open = false;

  constructor(
    private readonly threshold = 3,
    private readonly resetTimeoutMs = 10_000
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.open && Date.now() - this.lastFailureAt < this.resetTimeoutMs) {
      throw new Error("Circuit breaker is open");
    }

    try {
      const result = await operation();
      this.failures = 0;
      this.open = false;
      return result;
    } catch (error) {
      this.failures += 1;
      this.lastFailureAt = Date.now();
      if (this.failures >= this.threshold) {
        this.open = true;
      }
      throw error;
    }
  }
}
