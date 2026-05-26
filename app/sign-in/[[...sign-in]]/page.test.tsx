import { isValidElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./SignInCredentialsForm", () => ({
	default: () => <form className="grid w-full" />,
}));

type ElementProps = Record<string, unknown> & {
	alt?: string;
	children?: ReactNode;
	className?: string;
	src?: string;
};

function getChildren(element: ReactNode): ReactNode[] {
	if (!isValidElement<ElementProps>(element)) {
		return [];
	}

	return Array.isArray(element.props.children)
		? element.props.children
		: [element.props.children];
}

function findElement(
	node: ReactNode,
	predicate: (_props: ElementProps) => boolean,
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

function findElementByClassNamePart(
	node: ReactNode,
	classNamePart: string,
): ReactNode | undefined {
	return findElement(
		node,
		(props) =>
			typeof props.className === "string" &&
			props.className.includes(classNamePart),
	);
}

describe("SignInPage", () => {
	it("renders a full-screen split layout with a right-aligned Clerk sign-in form", async () => {
		const { default: SignInPage } = await import("./page");
		const pageElement = SignInPage();

		expect(
			findElementByClassNamePart(pageElement, "min-h-screen"),
		).toBeDefined();
		expect(
			findElementByClassNamePart(pageElement, "border-r border-white/10"),
		).toBeDefined();
		expect(
			findElementByClassNamePart(pageElement, "items-center justify-center"),
		).toBeDefined();

		const logo = findElement(
			pageElement,
			(props) => props.src === "/images/logo.png",
		);
		expect(isValidElement<ElementProps>(logo)).toBe(true);
		expect(
			isValidElement<ElementProps>(logo) ? logo.props.alt : undefined,
		).toBe("Page Home Pay");

		const formCard = findElementByClassNamePart(
			pageElement,
			"w-[min(100%,30rem)]",
		);
		expect(isValidElement<ElementProps>(formCard)).toBe(true);
	});
});
