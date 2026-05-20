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

async function renderHomeHeaderElement() {
	const { default: AppHeader } = await import("./AppHeader");
	return asElement(AppHeader({}));
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

function requireAriaLabelledBy(
	element: ReactElement<ElementProps>,
	expectedValue: string,
) {
	if (element.props["aria-labelledby"] !== expectedValue) {
		throw new Error(`Expected aria-labelledby prop to be ${expectedValue}`);
	}
}

function requireHtmlFor(
	element: ReactElement<ElementProps>,
	expectedValue: string,
) {
	if (element.props.htmlFor !== expectedValue) {
		throw new Error(`Expected htmlFor prop to be ${expectedValue}`);
	}
}

function requireId(element: ReactElement<ElementProps>, expectedValue: string) {
	if (element.props.id !== expectedValue) {
		throw new Error(`Expected id prop to be ${expectedValue}`);
	}
}

function requireType(
	element: ReactElement<ElementProps>,
	expectedValue: string,
) {
	if (element.props.type !== expectedValue) {
		throw new Error(`Expected type prop to be ${expectedValue}`);
	}
}

function requireAriaLabel(
	element: ReactElement<ElementProps>,
	expectedValue: string,
) {
	if (element.props["aria-label"] !== expectedValue) {
		throw new Error(`Expected aria-label prop to be ${expectedValue}`);
	}
}

describe("HomePage", () => {
	it("renders the initial application shell with navigation", async () => {
		const main = await renderHomePageElement();
		const [, heroNode] = Children.toArray(main.props.children);
		const header = await renderHomeHeaderElement();
		const hero = asElement(heroNode);

		expect(main.type).toBe("main");
		requireClassName(main, "app-shell");
		expect(main.props["data-theme"]).toBeUndefined();
		requireClassName(header, "top-navigation");
		expect(header.props["aria-label"]).toBeUndefined();
		expect(textFrom(header.props.children)).toContain("Dashboard");
		expect(textFrom(header.props.children)).toContain("Administración");
		expect(textFrom(header.props.children)).toContain("Categorías");
		expect(textFrom(header.props.children)).toContain("Contacto");
		requireClassName(hero, "hero-section");
		requireAriaLabelledBy(hero, "home-title");
	});

	it("includes theme controls", async () => {
		const header = await renderHomeHeaderElement();
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
		requireHtmlFor(themeToggle, "theme-switch");
		if (themeInput.type !== "input") {
			throw new Error("Expected theme toggle control to render an input");
		}
		requireId(themeInput, "theme-switch");
		requireType(themeInput, "checkbox");
		requireAriaLabel(themeInput, "Toggle dark and light theme");
		expect(textFrom(themeToggle.props.children)).toContain("☀");
		expect(textFrom(themeToggle.props.children)).toContain("☾");
	});

	it("includes an account dropdown menu", async () => {
		const header = await renderHomeHeaderElement();
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

	it("links navigation items and administration submenu", async () => {
		const main = await renderHomePageElement();
		const header = await renderHomeHeaderElement();
		const nav = asElement(Children.toArray(header.props.children)[1]);
		const [dashboardLinkNode, adminSubmenuNode, contactLinkNode] =
			Children.toArray(nav.props.children);
		const dashboardLink = asElement(dashboardLinkNode);
		const adminSubmenu = asElement(adminSubmenuNode);
		const contactLink = asElement(contactLinkNode);
		const [adminSummaryNode, adminPanelNode] = Children.toArray(
			adminSubmenu.props.children,
		);
		const adminSummary = asElement(adminSummaryNode);
		const adminPanelMenu = asElement(adminPanelNode);
		const adminLinks = Children.toArray(adminPanelMenu.props.children).map(
			asElement,
		);
		const hero = asElement(Children.toArray(main.props.children)[1]);
		const contentGrid = asElement(Children.toArray(main.props.children)[2]);
		const [adminSectionNode, contactPanelNode] = Children.toArray(
			contentGrid.props.children,
		);
		const adminSection = asElement(adminSectionNode);
		const contactPanel = asElement(contactPanelNode);

		expect(dashboardLink.props.href).toBe("#dashboard");
		expect(contactLink.props.href).toBe("#contacto");
		expect(adminSubmenu.type).toBe("details");
		requireClassName(adminSubmenu, "nav-submenu");
		expect(textFrom(adminSummary.props.children)).toContain("Administración");
		expect(adminLinks.map((link) => link.props.href)).toEqual([
			"#administración",
			"/categories",
		]);
		expect(textFrom(adminPanelMenu.props.children)).toContain("Categorías");
		requireId(hero, "dashboard");
		requireId(adminSection, "administración");
		requireId(contactPanel, "contacto");
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
		requireId(adminPanel, "administración");
		requireId(contactPanel, "contacto");
		expect(textFrom(adminPanel.props.children)).toContain("Próximos pagos");
		expect(textFrom(adminPanel.props.children)).toContain("Pending");
		expect(textFrom(adminPanel.props.children)).toContain("Paid");
		expect(textFrom(adminPanel.props.children)).toContain("Overdue");
		expect(textFrom(contactPanel.props.children)).toContain(
			"Base lista para crecer",
		);
	});
});
