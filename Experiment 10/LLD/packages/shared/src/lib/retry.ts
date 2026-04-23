export async function withRetry<T>(
  operation: () => Promise<T>,
  retries = 3,
  backoffMs = 250
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      await sleep(backoffMs * (attempt + 1));
    }
  }

  throw lastError;
}

function sleep(durationMs: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, durationMs));
}
