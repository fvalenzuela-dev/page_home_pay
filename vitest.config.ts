import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: {
			exclude: [
				".next/**",
				"coverage/**",
				"node_modules/**",
				"*.config.*",
				"next-env.d.ts",
			],
			include: ["app/**/*.{ts,tsx}"],
			provider: "v8",
			reporter: ["text", "lcov"],
		},
		environment: "node",
	},
});
