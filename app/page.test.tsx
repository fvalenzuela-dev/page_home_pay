import {
	Children,
	isValidElement,
	type ReactElement,
	type ReactNode,
} from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import HomeDashboard, {
	HomeDashboardView,
	MOCK_HOME_RECORDS,
	PAGE_SIZE_OPTIONS,
	getPaginatedHomeRecords,
} from "./HomeDashboard";
import { CATEGORY_COLOR_OPTIONS } from "./categories/categoryOptions";

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

function elementChildren(element: ReactElement<ElementProps>) {
	return Children.toArray(element.props.children).map(asElement);
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
	it("renders the application shell with the redesigned dashboard", async () => {
		const main = await renderHomePageElement();
		const [, heroNode, dashboardNode] = Children.toArray(main.props.children);
		const header = await renderHomeHeaderElement();
		const hero = asElement(heroNode);
		const dashboard = asElement(dashboardNode);

		expect(main.type).toBe("main");
		requireClassName(main, "app-shell");
		expect(main.props["data-theme"]).toBeUndefined();
		requireClassName(header, "top-navigation");
		expect(textFrom(header.props.children)).toContain("Dashboard");
		expect(textFrom(header.props.children)).toContain("Administración");
		expect(textFrom(header.props.children)).toContain("Categorías");
		expect(textFrom(header.props.children)).toContain("Contacto");
		requireClassName(hero, "hero-section");
		requireAriaLabelledBy(hero, "home-title");
		expect(typeof dashboard.type).toBe("function");
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
	});

	it("provides 50 mock records with safe pagination", () => {
		expect(MOCK_HOME_RECORDS).toHaveLength(50);
		expect(PAGE_SIZE_OPTIONS).toEqual([10, 25, 50]);

		const firstPage = getPaginatedHomeRecords(MOCK_HOME_RECORDS, 1, 10);
		const lastPage = getPaginatedHomeRecords(MOCK_HOME_RECORDS, 5, 10);
		const clampedPage = getPaginatedHomeRecords(MOCK_HOME_RECORDS, 99, 25);

		expect(firstPage.records).toHaveLength(10);
		expect(firstPage.totalPages).toBe(5);
		expect(firstPage.records[0]?.id).toBe(1);
		expect(lastPage.records.at(-1)?.id).toBe(50);
		expect(clampedPage.page).toBe(2);
		expect(clampedPage.records).toHaveLength(25);
	});

	it("renders all theme variant actions and the paginated grid view", () => {
		const pageChange = vi.fn();
		const pageSizeChange = vi.fn();
		const pagination = getPaginatedHomeRecords(MOCK_HOME_RECORDS, 2, 10);
		const view = asElement(
			HomeDashboardView({
				records: pagination.records,
				page: pagination.page,
				pageSize: 10,
				totalRecords: MOCK_HOME_RECORDS.length,
				totalPages: pagination.totalPages,
				onPageChange: pageChange,
				onPageSizeChange: pageSizeChange,
			}),
		);
		const [actionsPanel, gridPanel, contactPanel] = elementChildren(view);
		const [, actionsForm] = elementChildren(actionsPanel);
		const actionButtons = elementChildren(actionsForm);
		const [, tableWrap, paginationNav] = elementChildren(gridPanel);
		const table = elementChildren(tableWrap)[0];
		const [, , tbody] = elementChildren(table);
		const rows = elementChildren(tbody);
		const [gridHeader] = elementChildren(gridPanel);
		const [, pageSizeControl] = elementChildren(gridHeader);
		const [, pageSizeSelect] = elementChildren(pageSizeControl);
		const [previousButton, , nextButton] = elementChildren(paginationNav);

		requireClassName(view, "dashboard-layout");
		requireId(actionsPanel, "administración");
		requireId(gridPanel, "payment-grid");
		requireId(contactPanel, "contacto");
		expect(actionButtons).toHaveLength(CATEGORY_COLOR_OPTIONS.length);
		expect(actionButtons.map((button) => button.props.option)).toEqual(
			CATEGORY_COLOR_OPTIONS,
		);
		expect(rows).toHaveLength(10);
		expect(textFrom(table.props.children)).toMatch(
			/Showing\s+11\s+-\s+20\s+of\s+50\s+mock records/,
		);
		expect(textFrom(paginationNav.props.children)).toMatch(
			/Página\s+2\s+de\s+5/,
		);

		const changePageSize = pageSizeSelect.props.onChange;
		if (typeof changePageSize !== "function") {
			throw new Error("Expected page size select to have an onChange handler");
		}
		changePageSize({ target: { value: "25" } } as never);
		expect(pageSizeChange).toHaveBeenCalledWith(25);

		const previousPage = previousButton.props.onClick;
		if (typeof previousPage !== "function") {
			throw new Error("Expected previous page button to have an onClick handler");
		}
		previousPage({} as never);
		expect(pageChange).toHaveBeenCalledWith(1);

		const nextPage = nextButton.props.onClick;
		if (typeof nextPage !== "function") {
			throw new Error("Expected next page button to have an onClick handler");
		}
		nextPage({} as never);
		expect(pageChange).toHaveBeenCalledWith(3);
	});

	it("renders the client dashboard with default pagination state", () => {
		const markup = renderToStaticMarkup(<HomeDashboard />);

		expect(markup).toContain("Showing 1-10 of 50 mock records");
		expect(markup).toContain("Página 1 de 5");
		expect(markup).toContain("Rows per page");
	});
});
