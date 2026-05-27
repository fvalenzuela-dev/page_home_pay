import {
	Children,
	isValidElement,
	type ReactElement,
	type ReactNode,
} from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import HomeDashboard, {
	HOME_PAYMENT_GRID_COLUMNS,
	HomeDashboardView,
	MOCK_HOME_RECORDS,
	PAGE_SIZE_OPTIONS,
	getPaginatedHomeRecords,
	getThemeActionToastInput,
	type HomeRecord,
} from "./HomeDashboard";
import { CATEGORY_COLOR_OPTIONS } from "./categories/categoryOptions";
import {
	DataTable,
	DataTableColumnHeader,
	createGlobalFilter,
	type ColumnDef,
} from "./components/ui/data-table/data-table";

const themeMock = vi.hoisted(() => ({
	resolvedTheme: "light",
	setTheme: vi.fn(),
}));

vi.mock("@clerk/nextjs", () => ({
	UserButton: (props: Record<string, unknown>) => (
		<button data-testid="user-button" data-props={props} type="button">
			Perfil y cerrar sesión
		</button>
	),
}));

vi.mock("next-themes", () => ({
	useTheme: () => themeMock,
}));

type ElementProps = Record<string, unknown> & {
	children?: ReactNode;
};

type ComponentElement = ReactElement<ElementProps> & {
	type: (props: ElementProps) => ReactNode;
};

async function renderHomePageElement() {
	const { default: HomePage } = await import("./page");
	return asElement(HomePage());
}

async function renderHomeHeaderElement() {
	const { default: AppHeader } = await import("./components/layout/AppHeader");
	return asElement(AppHeader({}));
}

async function renderHomeHeaderMarkup() {
	const { default: AppHeader } = await import("./components/layout/AppHeader");
	return renderToStaticMarkup(<AppHeader />);
}

function getFirstTag(markup: string, tagName: string) {
	return getOpeningTags(markup, tagName)[0] ?? "";
}

function getOpeningTags(markup: string, tagName: string) {
	const tagPrefix = `<${tagName.toLowerCase()}`;
	const lowerMarkup = markup.toLowerCase();
	const openingTags: string[] = [];
	let searchIndex = 0;

	while (searchIndex < markup.length) {
		const tagStart = lowerMarkup.indexOf(tagPrefix, searchIndex);

		if (tagStart === -1) {
			break;
		}

		const tagNameEnd = tagStart + tagPrefix.length;
		if (!isTagBoundary(markup[tagNameEnd])) {
			searchIndex = tagNameEnd;
			continue;
		}

		const tagEnd = markup.indexOf(">", tagNameEnd);
		if (tagEnd === -1) {
			break;
		}

		openingTags.push(markup.slice(tagStart, tagEnd + 1));
		searchIndex = tagEnd + 1;
	}

	return openingTags;
}

function isTagBoundary(character: string | undefined) {
	return character === undefined || character === ">" || /\s/.test(character);
}

function hasTagWithAttribute(
	markup: string,
	tagName: string,
	attributeName: string,
	attributeValue: string,
) {
	const attributeText = `${attributeName.toLowerCase()}="${attributeValue.toLowerCase()}"`;

	return getOpeningTags(markup, tagName).some((tagMarkup) =>
		tagMarkup.toLowerCase().includes(attributeText),
	);
}

function getClassNameFromTag(tagMarkup: string) {
	return tagMarkup.match(/\sclass="([^"]*)"/i)?.[1] ?? "";
}

function isInputChecked(markup: string, inputId: string) {
	return getOpeningTags(markup, "input").some(
		(tagMarkup) =>
			tagMarkup.toLowerCase().includes(`id="${inputId.toLowerCase()}"`) &&
			tagMarkup.toLowerCase().includes("checked"),
	);
}

function asElement(node: ReactNode): ReactElement<ElementProps> {
	if (!isValidElement<ElementProps>(node)) {
		throw new Error("Expected a React element");
	}

	return node;
}

function isComponentElement(
	element: ReactElement<ElementProps>,
): element is ComponentElement {
	return typeof element.type === "function";
}

function renderCompositeNode(node: ReactNode): ReactNode {
	if (!isValidElement<ElementProps>(node)) {
		return node;
	}

	if (!isComponentElement(node)) {
		return node;
	}

	const Component = node.type;

	return renderCompositeNode(Component(node.props));
}

function findElementProps(
	node: ReactNode,
	predicate: (element: ReactElement<ElementProps>) => boolean,
): ElementProps | undefined {
	const renderedNode = renderCompositeNode(node);

	if (!isValidElement<ElementProps>(renderedNode)) {
		return undefined;
	}

	if (predicate(renderedNode)) {
		return renderedNode.props;
	}

	return Children.toArray(renderedNode.props.children)
		.map((child) => findElementProps(child, predicate))
		.find((props) => props !== undefined);
}

function elementChildren(element: ReactElement<ElementProps>) {
	return Children.toArray(element.props.children).map(asElement);
}

function requireClassNameContains(
	element: ReactElement<ElementProps>,
	expectedValue: string,
) {
	const className = element.props.className;
	if (typeof className !== "string" || !className.includes(expectedValue)) {
		throw new Error(`Expected className to contain ${expectedValue}`);
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

function requireId(element: ReactElement<ElementProps>, expectedValue: string) {
	if (element.props.id !== expectedValue) {
		throw new Error(`Expected id prop to be ${expectedValue}`);
	}
}

describe("HomePage", () => {
	beforeEach(() => {
		themeMock.resolvedTheme = "light";
		themeMock.setTheme.mockClear();
	});

	it("renders the application shell with the redesigned dashboard", async () => {
		const main = await renderHomePageElement();
		const [, heroNode, dashboardNode] = Children.toArray(main.props.children);
		const header = await renderHomeHeaderElement();
		const hero = asElement(heroNode);
		const dashboard = asElement(dashboardNode);

		const headerMarkup = await renderHomeHeaderMarkup();

		expect(main.type).toBe("main");
		requireClassNameContains(main, "min-h-screen");
		requireClassNameContains(main, "[.dark_&]");
		expect(main.props["data-theme"]).toBeUndefined();
		requireClassNameContains(header, "sticky top-0");
		expect(headerMarkup).toContain("Dashboard");
		expect(headerMarkup).toContain("Administración");
		expect(headerMarkup).toContain("Categorías");
		expect(headerMarkup).toContain("Contacto");
		requireClassNameContains(hero, "max-w-[1200px]");
		requireAriaLabelledBy(hero, "home-title");
		expect(typeof dashboard.type).toBe("function");
	});

	it("includes theme controls", async () => {
		const markup = await renderHomeHeaderMarkup();
		const fieldsetClassName = getClassNameFromTag(
			getFirstTag(markup, "fieldset"),
		);
		const legendClassName = getClassNameFromTag(getFirstTag(markup, "legend"));
		const labelClassName = getClassNameFromTag(getFirstTag(markup, "label"));

		expect(fieldsetClassName).toContain("flex min-w-0");
		expect(legendClassName).toBe("sr-only");
		expect(markup).toContain("Logged-in user management");
		expect(labelClassName).toContain("relative inline-grid");
		expect(hasTagWithAttribute(markup, "label", "for", "theme-switch")).toBe(
			true,
		);
		expect(hasTagWithAttribute(markup, "input", "id", "theme-switch")).toBe(
			true,
		);
		expect(hasTagWithAttribute(markup, "input", "type", "checkbox")).toBe(true);
		expect(
			hasTagWithAttribute(
				markup,
				"input",
				"aria-label",
				"Toggle dark and light theme",
			),
		).toBe(true);
		expect(markup).toContain("☀");
		expect(markup).toContain("☾");
		expect(isInputChecked(markup, "theme-switch")).toBe(false);
	});

	it("reflects the persisted dark theme in the header toggle", async () => {
		themeMock.resolvedTheme = "dark";

		const markup = await renderHomeHeaderMarkup();

		expect(isInputChecked(markup, "theme-switch")).toBe(true);
	});

	it("persists theme changes through next-themes", async () => {
		const header = await renderHomeHeaderElement();
		const themeSwitchProps = findElementProps(
			header,
			(element) =>
				element.type === "input" && element.props.id === "theme-switch",
		);

		if (typeof themeSwitchProps?.onChange !== "function") {
			throw new Error("Expected theme switch to define an onChange handler");
		}

		themeSwitchProps.onChange({ currentTarget: { checked: true } });
		themeSwitchProps.onChange({ currentTarget: { checked: false } });

		expect(themeMock.setTheme).toHaveBeenNthCalledWith(1, "dark");
		expect(themeMock.setTheme).toHaveBeenNthCalledWith(2, "light");
	});

	it("includes an account dropdown menu", async () => {
		const markup = await renderHomeHeaderMarkup();

		expect(markup).toContain("rounded-full border");
		expect(markup).not.toContain("Usuario");
		expect(markup).toContain('data-testid="user-button"');
		expect(markup).toContain("Perfil y cerrar sesión");
	});

	it("links navigation items and administration submenu", async () => {
		const main = await renderHomePageElement();
		const markup = await renderHomeHeaderMarkup();
		const detailsClassName = getClassNameFromTag(
			getFirstTag(markup, "details"),
		);
		const hero = asElement(Children.toArray(main.props.children)[1]);

		expect(hasTagWithAttribute(markup, "a", "href", "#dashboard")).toBe(true);
		expect(hasTagWithAttribute(markup, "a", "href", "#contacto")).toBe(true);
		expect(detailsClassName).toContain("group relative");
		expect(markup).toContain("Administración");
		expect(hasTagWithAttribute(markup, "a", "href", "#administracion")).toBe(
			true,
		);
		expect(hasTagWithAttribute(markup, "a", "href", "/categories")).toBe(true);
		expect(markup).toContain("Categorías");
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
		const view = asElement(
			HomeDashboardView({
				records: MOCK_HOME_RECORDS,
			}),
		);
		const gridMarkup = renderToStaticMarkup(
			<DataTable
				id="payment-grid"
				eyebrow="Grilla de pagos"
				title="Pagos del hogar"
				data={MOCK_HOME_RECORDS}
				columns={HOME_PAYMENT_GRID_COLUMNS}
				getRowId={(record) => record.id}
				searchColumnIds={[
					"merchant",
					"category",
					"dueDate",
					"status",
					"amount",
				]}
				getSearchableRowValues={(record) => [
					record.status === "Scheduled" ? "Programado" : record.status,
				]}
				searchPlaceholder="Buscar pagos..."
				totalSummary={(total) => `${total} registros`}
				paginationLabel="Paginación de la grilla de pagos"
			/>,
		);
		const viewMarkup = renderToStaticMarkup(view);
		const [actionsPanel, , contactPanel] = elementChildren(view);
		const [, actionsForm] = elementChildren(actionsPanel);
		const actionButtons = elementChildren(actionsForm);

		requireClassNameContains(view, "max-w-[1200px]");
		requireId(actionsPanel, "administracion");
		requireId(contactPanel, "contacto");
		expect(actionButtons).toHaveLength(CATEGORY_COLOR_OPTIONS.length);
		expect(actionButtons.map((button) => button.props.option)).toEqual(
			CATEGORY_COLOR_OPTIONS,
		);
		expect(CATEGORY_COLOR_OPTIONS.map((option) => option.value)).toEqual([
			"primary",
			"secondary",
			"success",
			"warning",
			"danger",
			"info",
			"neutral",
		]);
		expect(gridMarkup).toContain('id="payment-grid"');
		expect(gridMarkup).toContain("Buscar pagos...");
		expect(gridMarkup).toContain("50 registros");
		expect(gridMarkup).not.toContain("Mostrando 1-10 de 50 pagos de ejemplo");
		expect(gridMarkup).toContain("primary-container)_28%");
		expect(gridMarkup).toContain("Página 1 de 5");
		expect(gridMarkup).toContain("Filas por página");
		expect(viewMarkup).toContain("bg-success");
		expect(viewMarkup).toContain("bg-info");
		expect(viewMarkup).toContain("bg-surface");
		expect(gridMarkup).toContain("even:bg-[var(--surface-container-low)]");
		expect(gridMarkup).toContain("hover:bg-[var(--surface-container)]");
		expect(gridMarkup).toContain("Programado");
		expect(gridMarkup.match(/<tr/g)).toHaveLength(11);
	});

	it("maps administration action colors to toast variants", () => {
		expect(
			CATEGORY_COLOR_OPTIONS.map((option) => [
				option.value,
				getThemeActionToastInput(option).variant,
			]),
		).toEqual([
			["primary", "primary"],
			["secondary", "secondary"],
			["success", "success"],
			["warning", "warning"],
			["danger", "error"],
			["info", "info"],
			["neutral", "neutral"],
		]);
	});

	it("matches payment status searches against visible Spanish labels", () => {
		const filter = createGlobalFilter<HomeRecord>(["status"], (record) => [
			record.status === "Scheduled" ? "Programado" : record.status,
		]);
		const addMeta = vi.fn();
		const row = {
			original: MOCK_HOME_RECORDS[0],
			getValue: () => "Scheduled",
			getAllCells: () => [],
		};

		expect(filter(row, "", "programado", addMeta)).toBe(true);
		expect(filter(row, "", "scheduled", addMeta)).toBe(true);
		expect(filter(row, "", "pagado", addMeta)).toBe(false);
	});

	it("renders the client dashboard with default pagination state", () => {
		const markup = renderToStaticMarkup(<HomeDashboard />);

		expect(markup).toContain("50 registros");
		expect(markup).not.toContain("Mostrando 1-10 de 50 pagos de ejemplo");
		expect(markup).toContain("Página 1 de 5");
		expect(markup).toContain("Filas por página");
	});

	it("renders a reusable data table with dynamic sortable headers and cells", () => {
		interface ProductRecord {
			id: string;
			name: string;
			stock: number;
		}

		const columns: ColumnDef<ProductRecord>[] = [
			{
				accessorKey: "name",
				header: ({ column }) => (
					<DataTableColumnHeader column={column} title="Producto" />
				),
			},
			{
				accessorKey: "stock",
				header: ({ column }) => (
					<DataTableColumnHeader column={column} title="Disponibilidad" />
				),
				cell: ({ row }) => (
					<span
						className={
							row.original.stock > 0 ? "text-green-700" : "text-red-700"
						}
					>
						{row.original.stock > 0
							? `${row.original.stock} disponibles`
							: "Sin stock"}
					</span>
				),
			},
		];

		const markup = renderToStaticMarkup(
			<DataTable
				eyebrow="Inventario"
				title="Productos"
				data={[
					{ id: "p-1", name: "Coffee", stock: 12 },
					{ id: "p-2", name: "Tea", stock: 0 },
				]}
				columns={columns}
				getRowId={(row) => row.id}
				searchColumnIds={["name"]}
				searchPlaceholder="Buscar productos..."
			/>,
		);

		expect(markup).toContain("Buscar productos...");
		expect(markup).toContain("Producto");
		expect(markup).toContain("Disponibilidad");
		expect(markup).toContain("sin ordenar");
		expect(markup).toContain("Coffee");
		expect(markup).toContain("12 disponibles");
		expect(markup).toContain("Sin stock");
		expect(markup).not.toContain("Comercio");
		expect(markup).not.toContain("Importe");
	});
});
