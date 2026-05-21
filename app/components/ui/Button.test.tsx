import Link from "next/link";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Button from "./Button";

describe("Button", () => {
	it("renders a primary button by default", () => {
		const markup = renderToStaticMarkup(<Button>Ingresar</Button>);

		expect(markup).toContain("bg-primary");
		expect(markup).toContain("text-primary-foreground");
		expect(markup).toContain('type="button"');
		expect(markup).toContain("Ingresar");
	});

	it("supports submit type and additional classes", () => {
		const markup = renderToStaticMarkup(
			<Button className="w-full" type="submit" variant="outline">
				Guardar
			</Button>,
		);

		expect(markup).toContain('type="submit"');
		expect(markup).toContain("bg-transparent");
		expect(markup).toContain("border-border");
		expect(markup).toContain("w-full");
	});

	it("can render as a child link", () => {
		const markup = renderToStaticMarkup(
			<Button asChild variant="link">
				<Link href="/sign-in">Ir al login</Link>
			</Button>,
		);

		expect(markup).toContain('href="/sign-in"');
		expect(markup).not.toContain("<button");
		expect(markup).toContain("hover:underline");
	});
});
