import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import IconActionButton from "./IconActionButton";

describe("IconActionButton", () => {
	it("renders an accessible icon-only button with neutral styles by default", () => {
		const markup = renderToStaticMarkup(
			<IconActionButton aria-label="Editar categoría" icon="✎" />,
		);

		expect(markup).toContain('aria-label="Editar categoría"');
		expect(markup).toContain('type="button"');
		expect(markup).toContain("size-11");
		expect(markup).toContain("hover:bg-accent");
		expect(markup).toContain('aria-hidden="true"');
		expect(markup).toContain("✎");
	});

	it("supports danger-soft with a softer destructive background and focus outline", () => {
		const markup = renderToStaticMarkup(
			<IconActionButton
				aria-label="Eliminar categoría"
				icon="🗑"
				variant="danger-soft"
			/>,
		);

		expect(markup).toContain("bg-destructive/40");
		expect(markup).toContain("border-destructive/40");
		expect(markup).toContain("text-destructive");
		expect(markup).toContain("hover:bg-destructive/50");
		expect(markup).toContain("focus-visible:outline-destructive");
	});

	it("supports primary-soft with a soft primary background and accessible focus outline", () => {
		const markup = renderToStaticMarkup(
			<IconActionButton
				aria-label="Editar categoría"
				icon="✎"
				variant="primary-soft"
			/>,
		);

		expect(markup).toContain("bg-primary/15");
		expect(markup).toContain("border-primary/40");
		expect(markup).toContain("text-primary");
		expect(markup).toContain("hover:bg-primary/25");
		expect(markup).toContain("focus-visible:outline-ring");
	});

	it("passes through standard button props", () => {
		const markup = renderToStaticMarkup(
			<IconActionButton
				aria-label="Guardar categoría"
				className="custom-action"
				disabled
				icon="✓"
				type="submit"
			/>,
		);

		expect(markup).toContain('type="submit"');
		expect(markup).toContain("custom-action");
		expect(markup).toContain("disabled");
	});
});
