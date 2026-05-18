import { isValidElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs", () => ({
	ClerkProvider: ({ children }: { children: ReactNode }) => (
		<section data-testid="clerk-provider">{children}</section>
	),
}));

type ElementProps = Record<string, unknown> & {
	children?: ReactNode;
};

describe("RootLayout", () => {
	it("exports default metadata", async () => {
		const { metadata } = await import("./layout");

		expect(metadata).toEqual({
			description: "Home payment management application",
			title: "Page Home Pay",
		});
	});

	it("wraps the application document with Clerk session support", async () => {
		const { default: RootLayout } = await import("./layout");
		const child = <main>Test content</main>;
		const providerElement = RootLayout({ children: child });

		expect(isValidElement<ElementProps>(providerElement)).toBe(true);
		if (!isValidElement<ElementProps>(providerElement)) {
			throw new Error("RootLayout did not render ClerkProvider");
		}

		expect(providerElement.type).toEqual(expect.any(Function));
		const documentElement = providerElement.props.children;

		expect(isValidElement<ElementProps>(documentElement)).toBe(true);
		if (!isValidElement<ElementProps>(documentElement)) {
			throw new Error("RootLayout did not return an html element");
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
