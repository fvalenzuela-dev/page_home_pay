import { describe, expect, it } from "vitest";

import {
	CATEGORY_COLOR_OPTIONS,
	CATEGORY_ICON_OPTIONS,
	getCategoryColorLabel,
	getCategoryIconGlyph,
	getCategoryIconLabel,
} from "./categoryOptions";

describe("categoryOptions", () => {
	it("includes bill and payment related icons", () => {
		expect(CATEGORY_ICON_OPTIONS.map((option) => option.value)).toEqual([
			"car",
			"home",
			"electricity",
			"water",
			"gas",
			"internet",
			"phone",
			"credit-card",
			"insurance",
			"health",
			"education",
			"subscription",
		]);
		expect(getCategoryIconLabel("electricity")).toBe("Electricidad");
		expect(getCategoryIconGlyph("electricity")).toBe("⚡");
		expect(getCategoryIconLabel("custom-icon")).toBe("custom-icon");
		expect(getCategoryIconGlyph("custom-icon")).toBe("•");
	});

	it("includes semantic system colors", () => {
		expect(CATEGORY_COLOR_OPTIONS.map((option) => option.value)).toEqual([
			"primary",
			"secondary",
			"success",
			"danger",
			"warning",
			"info",
			"neutral",
		]);
		expect(getCategoryColorLabel("neutral")).toBe("Neutral/default");
		expect(getCategoryColorLabel("custom-color")).toBe("custom-color");
	});
});
