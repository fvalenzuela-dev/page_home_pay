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

function asElement(node: ReactNode): ReactElement<ElementProps> {
	if (!isValidElement<ElementProps>(node)) {
		throw new Error("Expected a React element");
	}

	return node;
}

function textFrom(node: ReactNode): string {
	return Children.toArray(node)
		.map((child) => {
			if (typeof child === "string" || typeof child === "number") {
				return String(child);
			}

			if (isValidElement<ElementProps>(child)) {
				return textFrom(child.props.children);
			}

			return "";
		})
		.join(" ");
}

function requireClassName(
	element: ReactElement<ElementProps>,
	expectedValue: string,
) {
	if (element.props.className !== expectedValue) {
		throw new Error(`Expected className to be ${expectedValue}`);
	}
}

function requirePropType(element: ReactElement<ElementProps>, expectedValue: string) {
	if (element.props.type !== expectedValue) {
		throw new Error(`Expected type prop to be ${expectedValue}`);
	}
}

describe("HomePage", () => {
	it("renders the initial application shell with navigation", () => {
		const main = asElement(HomePage());
		const [headerNode, heroNode] = Children.toArray(main.props.children);
		const header = asElement(headerNode);
		const hero = asElement(heroNode);

		expect(main.type).toBe("main");
		expect(main.props.className).toBe("app-shell");
		expect(main.props["data-theme"]).toBeUndefined();
		expect(header.props.className).toBe("top-navigation");
		expect(header.props["aria-label"]).toBeUndefined();
		expect(textFrom(header.props.children)).toContain("Dashboard");
		expect(textFrom(header.props.children)).toContain("Administración");
		expect(textFrom(header.props.children)).toContain("Contacto");
		expect(hero.props.className).toBe("hero-section");
		expect(hero.props["aria-labelledby"]).toBe("home-title");
	});

	it("includes user management and theme controls", () => {
		const main = asElement(HomePage());
		const header = asElement(Children.toArray(main.props.children)[0]);
		const headerChildren = Children.toArray(header.props.children);
		const userActions = asElement(headerChildren[2]);
		const [legendNode, themeToggleNode, userMenuNode] = Children.toArray(
			userActions.props.children,
		);
		const legend = asElement(legendNode);
		const themeToggle = asElement(themeToggleNode);
		const userMenu = asElement(userMenuNode);

		if (userActions.type !== "fieldset") {
			throw new Error("Expected user actions to render a fieldset");
		}
		requireClassName(userActions, "user-actions");
		if (legend.type !== "legend") {
			throw new Error("Expected user actions to include a legend");
		}
		requireClassName(legend, "sr-only");
		expect(textFrom(legend.props.children)).toContain(
			"Logged-in user management",
		);
		const [themeInputNode] = Children.toArray(themeToggle.props.children);
		const themeInput = asElement(themeInputNode);

		if (themeToggle.type !== "label") {
			throw new Error("Expected theme toggle to render a label");
		}
		requireClassName(themeToggle, "theme-toggle");
		if (themeToggle.props.htmlFor !== "theme-switch") {
			throw new Error("Expected theme label to target the theme switch");
		}
		if (themeInput.type !== "input") {
			throw new Error("Expected theme toggle control to render an input");
		}
		if (themeInput.props.id !== "theme-switch") {
			throw new Error("Expected theme input id to be theme-switch");
		}
		requirePropType(themeInput, "checkbox");
		if (themeInput.props["aria-label"] !== "Toggle dark and light theme") {
			throw new Error("Expected theme input to have an accessible label");
		}
		expect(textFrom(themeToggle.props.children)).toContain("☀");
		expect(textFrom(themeToggle.props.children)).toContain("☾");
		expect(textFrom(themeToggle.props.children)).toContain(
			"Toggle dark and light theme",
		);
		expect(userMenu.props.className).toBe("user-menu");
		expect(textFrom(userMenu.props.children)).toContain("Cuenta familiar");
	});

	it("links navigation items to shell sections", () => {
		const main = asElement(HomePage());
		const header = asElement(Children.toArray(main.props.children)[0]);
		const nav = asElement(Children.toArray(header.props.children)[1]);
		const navLinks = Children.toArray(nav.props.children).map(asElement);
		const hero = asElement(Children.toArray(main.props.children)[1]);
		const contentGrid = asElement(Children.toArray(main.props.children)[2]);
		const [adminPanelNode, contactPanelNode] = Children.toArray(
			contentGrid.props.children,
		);
		const adminPanel = asElement(adminPanelNode);
		const contactPanel = asElement(contactPanelNode);

		expect(navLinks.map((link) => link.props.href)).toEqual([
			"#dashboard",
			"#administración",
			"#contacto",
		]);
		expect(hero.props.id).toBe("dashboard");
		expect(adminPanel.props.id).toBe("administración");
		expect(contactPanel.props.id).toBe("contacto");
	});

	it("structures future dashboard, administration, and contact sections", () => {
		const main = asElement(HomePage());
		const contentGrid = asElement(Children.toArray(main.props.children)[2]);
		const [adminPanelNode, contactPanelNode] = Children.toArray(
			contentGrid.props.children,
		);
		const adminPanel = asElement(adminPanelNode);
		const contactPanel = asElement(contactPanelNode);

		expect(contentGrid.props.className).toBe("content-grid");
		expect(adminPanel.props.id).toBe("administración");
		expect(contactPanel.props.id).toBe("contacto");
		expect(textFrom(adminPanel.props.children)).toContain("Próximos pagos");
		expect(textFrom(adminPanel.props.children)).toContain("Pending");
		expect(textFrom(adminPanel.props.children)).toContain("Paid");
		expect(textFrom(adminPanel.props.children)).toContain("Overdue");
		expect(textFrom(contactPanel.props.children)).toContain(
			"Base lista para crecer",
		);
	});
});
