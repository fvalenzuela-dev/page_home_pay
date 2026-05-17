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

type ElementPredicate = (_: ElementProps) => boolean;

function findElement(
	node: ReactNode,
	predicate: ElementPredicate,
): ReactNode | undefined {
	if (isValidElement<ElementProps>(node) && predicate(node.props)) {
		return node;
	}

	for (const child of getChildren(node)) {
		const match = findElement(child, predicate);
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

		expect(
			findElement(pageElement, (props) => props.className === "auth-shell"),
		).toBeDefined();
		expect(
			findElement(
				pageElement,
				(props) => props.className === "auth-visual-panel",
			),
		).toBeDefined();
		expect(
			findElement(
				pageElement,
				(props) => props.className === "auth-form-panel",
			),
		).toBeDefined();

		const formCard = findElement(
			pageElement,
			(props) => props.className === "auth-form-card",
		);
		expect(isValidElement<ElementProps>(formCard)).toBe(true);
	});
});
