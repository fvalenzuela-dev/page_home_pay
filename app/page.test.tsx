import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage", () => {
	it("renders the setup landing content", () => {
		const html = renderToStaticMarkup(<HomePage />);

		expect(html).toContain("Page Home Pay");
		expect(html).toContain("Setup ready");
		expect(html).toContain("Next.js validation pipeline");
	});

	it("keeps the expected shell classes", () => {
		const html = renderToStaticMarkup(<HomePage />);

		expect(html).toContain('class="page-shell"');
		expect(html).toContain('class="hero-card"');
		expect(html).toContain('aria-labelledby="home-title"');
	});
});
