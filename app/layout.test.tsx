import { isValidElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
import RootLayout, { metadata } from "./layout";

type ElementProps = Record<string, unknown> & {
	children?: ReactNode;
};

describe("RootLayout", () => {
	it("exports default metadata", () => {
		expect(metadata).toEqual({
			description: "Home payment management application",
			title: "Page Home Pay",
		});
	});

	it("renders children inside the application document", () => {
		const child = <main>Test content</main>;
		const documentElement = RootLayout({ children: child });

		expect(isValidElement<ElementProps>(documentElement)).toBe(true);
		if (!isValidElement<ElementProps>(documentElement)) {
			throw new Error("RootLayout did not return a React element");
		}

		const bodyElement = documentElement.props.children;

		expect(documentElement.type).toBe("html");
		expect(documentElement.props.lang).toBe("en");
		expect(isValidElement<ElementProps>(bodyElement)).toBe(true);
		if (!isValidElement<ElementProps>(bodyElement)) {
			throw new Error("RootLayout did not render a body element");
		}

		expect(bodyElement.type).toBe("body");
		expect(bodyElement.props.children).toBe(child);
	});
});
