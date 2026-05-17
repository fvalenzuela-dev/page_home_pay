import {
	Children,
	isValidElement,
	type ReactElement,
	type ReactNode,
} from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs", () => ({
	UserButton: (props: Record<string, unknown>) => (
		<button data-testid="user-button" data-props={props} type="button">
			Perfil y cerrar sesión
		</button>
	),
}));

type ElementProps = Record<string, unknown> & {
	children?: ReactNode;
};

async function renderHomePageElement() {
	const { default: HomePage } = await import("./page");
	return asElement(HomePage());
}

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

function requirePropValue(
	element: ReactElement<ElementProps>,
	propName: string,
	expectedValue: unknown,
) {
	if (element.props[propName] !== expectedValue) {
		throw new Error(`Expected ${propName} prop to be ${String(expectedValue)}`);
	}
}

describe("HomePage", () => {
	it("renders the initial application shell with navigation", async () => {
		const main = await renderHomePageElement();
		const [headerNode, heroNode] = Children.toArray(main.props.children);
		const header = asElement(headerNode);
		const hero = asElement(heroNode);

		expect(main.type).toBe("main");
		requireClassName(main, "app-shell");
		expect(main.props["data-theme"]).toBeUndefined();
		requireClassName(header, "top-navigation");
		expect(header.props["aria-label"]).toBeUndefined();
		expect(textFrom(header.props.children)).toContain("Dashboard");
		expect(textFrom(header.props.children)).toContain("Administración");
		expect(textFrom(header.props.children)).toContain("Contacto");
		requireClassName(hero, "hero-section");
		requirePropValue(hero, "aria-labelledby", "home-title");
	});

	it("includes theme controls", async () => {
		const main = await renderHomePageElement();
		const header = asElement(Children.toArray(main.props.children)[0]);
		const userActions = asElement(Children.toArray(header.props.children)[2]);
		const [legendNode, themeToggleNode] = Children.toArray(
			userActions.props.children,
		);
		const legend = asElement(legendNode);
		const themeToggle = asElement(themeToggleNode);

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
		requirePropValue(themeToggle, "htmlFor", "theme-switch");
		if (themeInput.type !== "input") {
			throw new Error("Expected theme toggle control to render an input");
		}
		requirePropValue(themeInput, "id", "theme-switch");
		requirePropValue(themeInput, "type", "checkbox");
		requirePropValue(themeInput, "aria-label", "Toggle dark and light theme");
		expect(textFrom(themeToggle.props.children)).toContain("☀");
		expect(textFrom(themeToggle.props.children)).toContain("☾");
	});

	it("includes an account dropdown menu", async () => {
		const main = await renderHomePageElement();
		const header = asElement(Children.toArray(main.props.children)[0]);
		const userActions = asElement(Children.toArray(header.props.children)[2]);
		const accountMenu = asElement(
			Children.toArray(userActions.props.children)[2],
		);

		requireClassName(accountMenu, "account-menu");
		expect(textFrom(accountMenu.props.children)).not.toContain("Usuario");

		const userButton = asElement(
			Children.toArray(accountMenu.props.children)[0],
		);
		expect(userButton.props.showName).toBe(true);
		expect(userButton.props.userProfileMode).toBe("modal");
		expect(userButton.props.appearance).toEqual(
			expect.objectContaining({
				elements: expect.objectContaining({
					userButtonTrigger: "account-menu-trigger",
					userButtonOuterIdentifier: "account-menu-name",
				}),
			}),
		);
	});

	it("links navigation items to shell sections", async () => {
		const main = await renderHomePageElement();
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
		requirePropValue(hero, "id", "dashboard");
		requirePropValue(adminPanel, "id", "administración");
		requirePropValue(contactPanel, "id", "contacto");
	});

	it("structures future dashboard, administration, and contact sections", async () => {
		const main = await renderHomePageElement();
		const contentGrid = asElement(Children.toArray(main.props.children)[2]);
		const [adminPanelNode, contactPanelNode] = Children.toArray(
			contentGrid.props.children,
		);
		const adminPanel = asElement(adminPanelNode);
		const contactPanel = asElement(contactPanelNode);

		requireClassName(contentGrid, "content-grid");
		requirePropValue(adminPanel, "id", "administración");
		requirePropValue(contactPanel, "id", "contacto");
		expect(textFrom(adminPanel.props.children)).toContain("Próximos pagos");
		expect(textFrom(adminPanel.props.children)).toContain("Pending");
		expect(textFrom(adminPanel.props.children)).toContain("Paid");
		expect(textFrom(adminPanel.props.children)).toContain("Overdue");
		expect(textFrom(contactPanel.props.children)).toContain(
			"Base lista para crecer",
		);
	});
});
