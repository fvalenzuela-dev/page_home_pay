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

	it("supports the secondary variant", () => {
		const markup = renderToStaticMarkup(
			<Button variant="secondary">Cancelar</Button>,
		);

		expect(markup).toContain("bg-secondary");
		expect(markup).toContain("text-secondary-foreground");
		expect(markup).toContain("hover:bg-secondary-hover");
	});

	it("supports semantic success, info, warning, danger, and neutral variants", () => {
		const successMarkup = renderToStaticMarkup(
			<Button variant="success">Guardado</Button>,
		);
		const infoMarkup = renderToStaticMarkup(
			<Button variant="info">Información</Button>,
		);
		const warningMarkup = renderToStaticMarkup(
			<Button variant="warning">Cancelar</Button>,
		);
		const dangerMarkup = renderToStaticMarkup(
			<Button variant="danger">Eliminar</Button>,
		);
		const neutralMarkup = renderToStaticMarkup(
			<Button variant="neutral">Neutral</Button>,
		);

		expect(successMarkup).toContain("bg-success");
		expect(successMarkup).toContain("text-success-foreground");
		expect(infoMarkup).toContain("bg-info");
		expect(infoMarkup).toContain("text-info-foreground");
		expect(warningMarkup).toContain("bg-warning");
		expect(warningMarkup).toContain("text-warning-foreground");
		expect(warningMarkup).toContain("hover:bg-warning-hover");
		expect(warningMarkup).toContain("focus-visible:outline-warning-focus");
		expect(dangerMarkup).toContain("bg-destructive");
		expect(neutralMarkup).toContain("bg-surface");
	});

	it("can render as a child link", () => {
		const markup = renderToStaticMarkup(
			<Button asChild variant="link">
				<Link href="/sign-in">Ir al login</Link>
			</Button>,
		);

		expect(markup).toContain('href="/sign-in"');
		expect(markup).not.toMatch(/<button(?:\s|>)/i);
		expect(markup).toContain("hover:underline");
	});
});
