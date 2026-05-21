import {
	Children,
	isValidElement,
	type ReactElement,
	type ReactNode,
} from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import HomeDashboard, {
	HOME_PAYMENT_GRID_COLUMNS,
	HomeDashboardView,
	MOCK_HOME_RECORDS,
	PAGE_SIZE_OPTIONS,
	getPaginatedHomeRecords,
	type HomeRecord,
} from "./HomeDashboard";
import { CATEGORY_COLOR_OPTIONS } from "./categories/categoryOptions";
import {
	DataTable,
	DataTableColumnHeader,
	createGlobalFilter,
	type ColumnDef,
} from "./components/ui/data-table/data-table";

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
	const { default: AppHeader } = await import("./components/layout/AppHeader");
	return asElement(AppHeader({}));
}

async function renderHomeHeaderMarkup() {
	const { default: AppHeader } = await import("./components/layout/AppHeader");
	return renderToStaticMarkup(<AppHeader />);
}

function getFirstTag(markup: string, tagName: string) {
	return markup.match(new RegExp(`<${tagName}\\b[^>]*>`, "i"))?.[0] ?? "";
}

function hasTagWithAttribute(
	markup: string,
	tagName: string,
	attributeName: string,
	attributeValue: string,
) {
	return new RegExp(
		`<${tagName}\\b[^>]*\\s${attributeName}="${attributeValue}"`,
		"i",
	).test(markup);
}

function getClassNameFromTag(tagMarkup: string) {
	return tagMarkup.match(/\sclass="([^"]*)"/i)?.[1] ?? "";
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
	it("renders the application shell with the redesigned dashboard", async () => {
		const main = await renderHomePageElement();
		const [, heroNode, dashboardNode] = Children.toArray(main.props.children);
		const header = await renderHomeHeaderElement();
		const hero = asElement(heroNode);
		const dashboard = asElement(dashboardNode);

		const headerMarkup = await renderHomeHeaderMarkup();

		expect(main.type).toBe("main");
		requireClassNameContains(main, "min-h-screen");
		requireClassNameContains(main, "has-[#theme-switch:checked]");
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
		const fieldsetClassName = getClassNameFromTag(getFirstTag(markup, "fieldset"));
		const legendClassName = getClassNameFromTag(getFirstTag(markup, "legend"));
		const labelClassName = getClassNameFromTag(
			getFirstTag(markup, "label"),
		);

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
		expect(hasTagWithAttribute(markup, "input", "type", "checkbox")).toBe(
			true,
		);
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
		const detailsClassName = getClassNameFromTag(getFirstTag(markup, "details"));
		const hero = asElement(Children.toArray(main.props.children)[1]);

		expect(hasTagWithAttribute(markup, "a", "href", "#dashboard")).toBe(true);
		expect(hasTagWithAttribute(markup, "a", "href", "#contacto")).toBe(true);
		expect(detailsClassName).toContain("group relative");
		expect(markup).toContain("Administración");
		expect(hasTagWithAttribute(markup, "a", "href", "#administración")).toBe(
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
				searchColumnIds={["merchant", "category", "dueDate", "status", "amount"]}
				getSearchableRowValues={(record) => [
					record.status === "Scheduled" ? "Programado" : record.status,
				]}
				searchPlaceholder="Buscar pagos..."
				totalSummary={(total) => `${total} registros`}
				paginationLabel="Paginación de la grilla de pagos"
			/>,
		);
		const [actionsPanel, , contactPanel] = elementChildren(view);
		const [, actionsForm] = elementChildren(actionsPanel);
		const actionButtons = elementChildren(actionsForm);

		requireClassNameContains(view, "max-w-[1200px]");
		requireId(actionsPanel, "administración");
		requireId(contactPanel, "contacto");
		expect(actionButtons).toHaveLength(CATEGORY_COLOR_OPTIONS.length);
		expect(actionButtons.map((button) => button.props.option)).toEqual(
			CATEGORY_COLOR_OPTIONS,
		);
		expect(gridMarkup).toContain('id="payment-grid"');
		expect(gridMarkup).toContain("Buscar pagos...");
		expect(gridMarkup).toContain("50 registros");
		expect(gridMarkup).not.toContain("Mostrando 1-10 de 50 pagos de ejemplo");
		expect(gridMarkup).toContain("primary-container)_28%");
		expect(gridMarkup).toContain("Página 1 de 5");
		expect(gridMarkup).toContain("Filas por página");
		expect(gridMarkup).toContain("even:bg-[var(--surface-container-low)]");
		expect(gridMarkup).toContain("hover:bg-[var(--surface-container)]");
		expect(gridMarkup).toContain("Programado");
		expect(gridMarkup.match(/<tr/g)).toHaveLength(11);
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
						className={row.original.stock > 0 ? "text-green-700" : "text-red-700"}
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
