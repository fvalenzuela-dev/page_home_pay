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

function requirePropType(
	element: ReactElement<ElementProps>,
	expectedValue: string,
) {
	if (element.props.type !== expectedValue) {
		throw new Error(`Expected type prop to be ${expectedValue}`);
	}
}

describe("HomePage", () => {
	it("renders the initial application shell with navigation", async () => {
		const { default: HomePage } = await import("./page");
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

	it("includes theme controls and an account dropdown menu", async () => {
		const { default: HomePage } = await import("./page");
		const main = asElement(HomePage());
		const header = asElement(Children.toArray(main.props.children)[0]);
		const headerChildren = Children.toArray(header.props.children);
		const userActions = asElement(headerChildren[2]);
		const [legendNode, themeToggleNode, accountMenuNode] = Children.toArray(
			userActions.props.children,
		);
		const legend = asElement(legendNode);
		const themeToggle = asElement(themeToggleNode);
		const accountMenu = asElement(accountMenuNode);

		expect(userActions.type).toBe("fieldset");
		requireClassName(userActions, "user-actions");
		expect(legend.type).toBe("legend");
		requireClassName(legend, "sr-only");
		expect(textFrom(legend.props.children)).toContain(
			"Logged-in user management",
		);
		const [themeInputNode] = Children.toArray(themeToggle.props.children);
		const themeInput = asElement(themeInputNode);

		expect(themeToggle.type).toBe("label");
		requireClassName(themeToggle, "theme-toggle");
		expect(themeToggle.props.htmlFor).toBe("theme-switch");
		expect(themeInput.type).toBe("input");
		expect(themeInput.props.id).toBe("theme-switch");
		requirePropType(themeInput, "checkbox");
		expect(themeInput.props["aria-label"]).toBe("Toggle dark and light theme");
		expect(textFrom(themeToggle.props.children)).toContain("☀");
		expect(textFrom(themeToggle.props.children)).toContain("☾");
		expect(textFrom(themeToggle.props.children)).toContain(
			"Toggle dark and light theme",
		);
		expect(accountMenu.props.className).toBe("account-menu");
		expect(accountMenu.props.role).toBe("group");
		expect(accountMenu.props["aria-label"]).toBe("User profile menu");
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
		const { default: HomePage } = await import("./page");
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

	it("structures future dashboard, administration, and contact sections", async () => {
		const { default: HomePage } = await import("./page");
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
