import { RetryUtil } from "../retry.util";
import { OptimisticError } from "../../errors/optimistic.error";

describe("RetryUtil", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("execute", () => {
		it("should succeed on first attempt", async () => {
			const operation = jest.fn().mockResolvedValue("success");

			const result = await RetryUtil.execute(operation);

			expect(result.result).toBe("success");
			expect(result.attemptCount).toBe(1);
			expect(operation).toHaveBeenCalledTimes(1);
		});

		it("should retry on OptimisticError and eventually succeed", async () => {
			const operation = jest.fn()
				.mockRejectedValueOnce(new OptimisticError("Version conflict"))
				.mockRejectedValueOnce(new OptimisticError("Version conflict"))
				.mockResolvedValue("success");

			const result = await RetryUtil.execute(operation, { maxRetries: 3 });

			expect(result.result).toBe("success");
			expect(result.attemptCount).toBe(3);
			expect(operation).toHaveBeenCalledTimes(3);
		});

		it("should fail after max retries exceeded", async () => {
			const operation = jest.fn().mockRejectedValue(new OptimisticError("Version conflict"));

			await expect(
				RetryUtil.execute(operation, { maxRetries: 2 })
			).rejects.toThrow("Optimistic lock conflict after 3 attempts");

			expect(operation).toHaveBeenCalledTimes(3); // Initial + 2 retries
		});

		it("should not retry non-retryable errors", async () => {
			const nonRetryableError = new Error("Not retryable");
			const operation = jest.fn().mockRejectedValue(nonRetryableError);

			await expect(
				RetryUtil.execute(operation, { maxRetries: 3 })
			).rejects.toBe(nonRetryableError);

			expect(operation).toHaveBeenCalledTimes(1);
		});

		it("should respect custom retryable errors", async () => {
			class CustomError extends Error { }
			const operation = jest.fn()
				.mockRejectedValueOnce(new CustomError("Custom error"))
				.mockResolvedValue("success");

			const result = await RetryUtil.execute(operation, {
				maxRetries: 2,
				retryableErrors: [CustomError]
			});

			expect(result.result).toBe("success");
			expect(result.attemptCount).toBe(2);
		});
	});

	describe("executeWithOptimisticLock", () => {
		it("should use optimistic lock specific configuration", async () => {
			const operation = jest.fn()
				.mockRejectedValueOnce(new OptimisticError("Version conflict"))
				.mockResolvedValue("success");

			const result = await RetryUtil.executeWithOptimisticLock(operation);

			expect(result).toBe("success");
			expect(operation).toHaveBeenCalledTimes(2);
		});

		it("should respect custom max retries", async () => {
			const operation = jest.fn().mockRejectedValue(new OptimisticError("Version conflict"));

			await expect(
				RetryUtil.executeWithOptimisticLock(operation, 1)
			).rejects.toThrow("Optimistic lock conflict after 2 attempts");

			expect(operation).toHaveBeenCalledTimes(2); // Initial + 1 retry
		});
	});

	describe("delay calculation", () => {
		it("should calculate exponential backoff delays", async () => {
			const operation = jest.fn().mockRejectedValue(new OptimisticError("Version conflict"));
			const delays: number[] = [];

			// Mock setTimeout to capture delays
			const originalSetTimeout = global.setTimeout;
			global.setTimeout = jest.fn((callback, delay) => {
				delays.push(delay);
				return originalSetTimeout(callback, 0); // Execute immediately for test
			}) as any;

			try {
				await RetryUtil.execute(operation, {
					maxRetries: 3,
					baseDelayMs: 100,
					jitter: false // Disable jitter for predictable testing
				});
			} catch {
				// Expected to fail
			}

			// Should have exponential delays: 100, 200, 400
			expect(delays).toHaveLength(3);
			expect(delays[0]).toBe(100);
			expect(delays[1]).toBe(200);
			expect(delays[2]).toBe(400);

			global.setTimeout = originalSetTimeout;
		});

		it("should cap delays at maxDelayMs", async () => {
			const operation = jest.fn().mockRejectedValue(new OptimisticError("Version conflict"));
			const delays: number[] = [];

			const originalSetTimeout = global.setTimeout;
			global.setTimeout = jest.fn((callback, delay) => {
				delays.push(delay);
				return originalSetTimeout(callback, 0);
			}) as any;

			try {
				await RetryUtil.execute(operation, {
					maxRetries: 5,
					baseDelayMs: 1000,
					maxDelayMs: 2000,
					jitter: false
				});
			} catch {
				// Expected to fail
			}

			// Should cap at maxDelayMs: 1000, 2000, 2000, 2000, 2000
			expect(delays.every(delay => delay <= 2000)).toBe(true);
			expect(delays.filter(delay => delay === 2000).length).toBe(4);

			global.setTimeout = originalSetTimeout;
		});
	});
});
