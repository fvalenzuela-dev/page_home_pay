import { isValidElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./SignInCredentialsForm", () => ({
	default: () => <form className="auth-credentials-form" />,
}));

type ElementProps = Record<string, unknown> & {
	children?: ReactNode;
	className?: string;
};

function getChildren(element: ReactNode): ReactNode[] {
	if (!isValidElement<ElementProps>(element)) {
		return [];
	}

	return Array.isArray(element.props.children)
		? element.props.children
		: [element.props.children];
}

function findElementByClassName(
	node: ReactNode,
	className: string,
): ReactNode | undefined {
	if (
		isValidElement<ElementProps>(node) &&
		node.props.className === className
	) {
		return node;
	}

	for (const child of getChildren(node)) {
		const match = findElementByClassName(child, className);
		if (match) {
			return match;
		}
	}

	return undefined;
}

describe("SignInPage", () => {
	it("renders a full-screen split layout with a right-aligned Clerk sign-in form", async () => {
		const { default: SignInPage } = await import("./page");
		const pageElement = SignInPage();

		expect(findElementByClassName(pageElement, "auth-shell")).toBeDefined();
		expect(
			findElementByClassName(pageElement, "auth-visual-panel"),
		).toBeDefined();
		expect(
			findElementByClassName(pageElement, "auth-form-panel"),
		).toBeDefined();

		const formCard = findElementByClassName(pageElement, "auth-form-card");
		expect(isValidElement<ElementProps>(formCard)).toBe(true);
	});
});
