import { isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
import RootLayout, { metadata } from "./layout";

type ElementProps = Record<string, unknown> & {
	children?: ReactNode;
};

function expectElement(node: ReactNode, type: string): ReactElement<ElementProps> {
	expect(isValidElement(node)).toBe(true);

	const element = node as ReactElement<ElementProps>;
	expect(element.type).toBe(type);

	return element;
}

describe("RootLayout", () => {
	it("exports default metadata", () => {
		expect(metadata).toEqual({
			description: "Home payment management application",
			title: "Page Home Pay",
		});
	});

	it("renders children inside the application document", () => {
		const child = <main>Test content</main>;
		const html = expectElement(RootLayout({ children: child }), "html");
		const body = expectElement(html.props.children, "body");

		expect(html.props.lang).toBe("en");
		expect(body.props.children).toBe(child);
	});
});
