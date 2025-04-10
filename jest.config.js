/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
	testEnvironment: "node",
	testMatch: [
		'**/__tests__/**/*.test.ts',
		'**/__test__/**/*.test.ts',
	],
	setupFiles: ["dotenv/config"],
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	transform: {
		"^.+.tsx?$": ["ts-jest", {}],
	},
	testTimeout: 120000 // 2 minutes,
};