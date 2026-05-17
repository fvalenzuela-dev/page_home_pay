import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(process.cwd(), "app", "globals.css"), "utf8");

describe("global shell styles", () => {
	it("defines Serene Ledger design tokens", () => {
		expect(css).toContain("--surface: #f8f9ff");
		expect(css).toContain("--primary: #004ac6");
		expect(css).toContain("--secondary: #006c49");
		expect(css).toContain("--error: #ba1a1a");
		expect(css).toContain("Manrope");
		expect(css).toContain("font-variant-numeric: tabular-nums");
	});

	it("supports a CSS-driven dark theme toggle", () => {
		expect(css).toContain(".app-shell:has(#theme-switch:checked)");
		expect(css).toContain("color-scheme: dark");
		expect(css).toContain("--surface: #0b1c30");
		expect(css).toContain(".dark-icon");
		expect(css).toContain(".light-icon");
		expect(css).toContain("opacity: 0");
		expect(css).toContain(".theme-toggle:focus-within");
		expect(css).toContain("box-shadow: 0 0 0 3px");
	});

	it("keeps the layout responsive on tablet and narrow screens", () => {
		expect(css).toContain("@media (max-width: 880px)");
		expect(css).toContain("@media (max-width: 560px)");
		expect(css).toContain("grid-template-columns: 1fr");
		expect(css).toContain("overflow-x: auto");
	});

	it("styles payment status chips with enforced semantic classes", () => {
		expect(css).toContain(".status-chip.paid");
		expect(css).toContain(".status-chip.pending");
		expect(css).toContain(".status-chip.overdue");
		expect(css).toContain("border-radius: 9999px");
	});
});
