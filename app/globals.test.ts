import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(process.cwd(), "app", "globals.css"), "utf8");

describe("global Tailwind entrypoint", () => {
	it("imports Tailwind CSS and defines theme tokens", () => {
		expect(css).toContain('@import "tailwindcss"');
		expect(css).toContain("@theme");
		expect(css).toContain("--color-primary:");
		expect(css).toContain("--color-primary-foreground:");
		expect(css).toContain("--color-border:");
		expect(css).toContain("--shadow-primary:");
	});
});
