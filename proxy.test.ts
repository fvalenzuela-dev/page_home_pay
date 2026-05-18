import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const proxySource = () => readFileSync(join(process.cwd(), "proxy.ts"), "utf8");

describe("Clerk proxy", () => {
	it("protects application routes while keeping sign-in and static assets public", () => {
		const source = proxySource();

		expect(source).toContain("export const proxy");
		expect(source).toContain("clerkMiddleware");
		expect(source).toContain("createRouteMatcher");
		expect(source).toContain("/sign-in(.*)");
		expect(source).toContain("/sign-up(.*)");
		expect(source).toContain("auth.protect()");
		expect(source).toContain("_next");
		expect(source).toContain("css");
		expect(source).toContain("png");
		expect(source).toContain("svg");
	});
});
