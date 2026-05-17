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
		expect(header.props["aria-label"]).toBe("Primary navigation");
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
		const [themeToggleNode, userMenuNode] = Children.toArray(
			userActions.props.children,
		);
		const themeToggle = asElement(themeToggleNode);
		const userMenu = asElement(userMenuNode);

		expect(userActions.props.className).toBe("user-actions");
		expect(userActions.props["aria-label"]).toBe("Logged-in user management");
		const [themeInputNode] = Children.toArray(themeToggle.props.children);
		const themeInput = asElement(themeInputNode);

		expect(themeToggle.type).toBe("label");
		expect(themeToggle.props.className).toBe("theme-toggle");
		expect(themeToggle.props.htmlFor).toBe("theme-switch");
		expect(themeInput.type).toBe("input");
		expect(themeInput.props.id).toBe("theme-switch");
		expect(themeInput.props.type).toBe("checkbox");
		expect(themeInput.props["aria-label"]).toBe(
			"Toggle dark and light theme",
		);
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
