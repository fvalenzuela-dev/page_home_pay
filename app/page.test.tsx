import {
	Children,
	isValidElement,
	type ReactElement,
	type ReactNode,
} from "react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

type ElementProps = Record<string, unknown> & {
	children?: ReactNode;
};

function expectElement(
	node: ReactNode,
	type: string,
): ReactElement<ElementProps> {
	expect(isValidElement(node)).toBe(true);

	const element = node as ReactElement<ElementProps>;
	expect(element.type).toBe(type);

	return element;
}

describe("HomePage", () => {
	it("renders the setup landing content", () => {
		const main = expectElement(HomePage(), "main");
		const section = expectElement(
			Children.toArray(main.props.children)[0],
			"section",
		);
		const [eyebrowNode, headingNode, descriptionNode] = Children.toArray(
			section.props.children,
		);
		const eyebrow = expectElement(eyebrowNode, "p");
		const heading = expectElement(headingNode, "h1");
		const description = expectElement(descriptionNode, "p");

		expect(eyebrow.props.children).toBe("Setup ready");
		expect(heading.props.children).toBe("Page Home Pay");
		expect(Children.toArray(description.props.children).join(" ")).toContain(
			"Next.js validation pipeline",
		);
	});

	it("keeps the expected shell attributes", () => {
		const main = expectElement(HomePage(), "main");
		const section = expectElement(
			Children.toArray(main.props.children)[0],
			"section",
		);

		expect(main.props.className).toBe("page-shell");
		expect(section.props.className).toBe("hero-card");
		expect(section.props["aria-labelledby"]).toBe("home-title");
	});
});
