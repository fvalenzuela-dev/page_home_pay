import { isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs", () => ({
	useAuth: () => ({ getToken: vi.fn() }),
}));

function asElement(node: ReactNode): ReactElement<Record<string, unknown>> {
	if (!isValidElement<Record<string, unknown>>(node)) {
		throw new Error("Expected a React element");
	}

	return node;
}

describe("CategoriesPage", () => {
	it("renders the categories management screen", async () => {
		const { default: CategoriesPage, metadata } = await import("./page");
		const element = asElement(CategoriesPage());

		expect(metadata.title).toBe("Categorías | Page Home Pay");
		expect(element.type).not.toBe("main");
	});
});
