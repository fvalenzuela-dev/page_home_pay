import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import RootLayout, { metadata } from "./layout";

describe("RootLayout", () => {
	it("exports default metadata", () => {
		expect(metadata).toEqual({
			description: "Home payment management application",
			title: "Page Home Pay",
		});
	});

	it("renders children inside the application document", () => {
		const html = renderToStaticMarkup(
			<RootLayout>
				<main>Test content</main>
			</RootLayout>,
		);

		expect(html).toContain('<html lang="en">');
		expect(html).toContain("Test content");
	});
});
