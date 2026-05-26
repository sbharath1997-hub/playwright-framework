import { test, expect } from '../fixtures/baseTest';

test.describe('Hooks demo: beforeAll & beforeEach', () => {
	// Declare shared variables at file scope
	let sharedToken: string; // declared here
	let perTestCounter: number; // declared here

	// Runs once before all tests in this describe
	test.beforeAll(async () => {
		// Simulate expensive/auth setup done once (worker-scoped in real use)
		sharedToken = 'token-abc-123';
	});

	// Runs before each test — use for per-test initialization
	test.beforeEach(async ({ homePage }) => {
		// Initialize variables inside hooks to avoid shared mutable state
		perTestCounter = 0; // initialized fresh for every test
		await homePage.openHomePage();
	});

	test('reads shared token without mutating it', async ({ page }) => {
		expect(sharedToken).toBeDefined();
		// use sharedToken (read-only) to authenticate or seed data
		await page.evaluate((t) => t, sharedToken);
	});

	test('per-test state is isolated', async ({ page }) => {
		perTestCounter += 1;
		expect(perTestCounter).toBe(1); // fresh value each test
		await page.evaluate((c) => c, perTestCounter);
	});
});