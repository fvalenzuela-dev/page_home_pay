import {
	Children,
	isValidElement,
	type ReactElement,
	type ReactNode,
} from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getToken = vi.fn();

vi.mock("@clerk/nextjs", () => ({
	UserButton: (props: Record<string, unknown>) => (
		<button data-testid="user-button" data-props={props} type="button">
			Perfil y cerrar sesión
		</button>
	),
	useAuth: () => ({ getToken }),
}));

async function loadScreen() {
	return import("./CategoriesScreen");
}

type ElementProps = Record<string, unknown> & {
	children?: ReactNode;
};

function requireMarkup(markup: string, expected: string) {
	if (!markup.includes(expected)) {
		throw new Error(`Expected markup to include ${expected}`);
	}
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

function collectElements(node: ReactNode): ReactElement<ElementProps>[] {
	if (!isValidElement<ElementProps>(node)) {
		return [];
	}

	if (typeof node.type === "function" && node.type.name !== "DataTable") {
		return collectElements(
			Reflect.apply(node.type, undefined, [node.props]) as ReactNode,
		);
	}

	return [
		node,
		...Children.toArray(node.props.children).flatMap((child) =>
			collectElements(child),
		),
	];
}

function callHandler(handler: unknown, event?: unknown) {
	if (typeof handler !== "function") {
		throw new Error("Expected a handler function");
	}

	Reflect.apply(handler, undefined, [event]);
}

describe("CategoriesScreen", () => {
	beforeEach(() => {
		getToken.mockResolvedValue("test-token");
	});

	it("renders loading, empty, and error states", async () => {
		const { default: CategoriesScreen } = await loadScreen();

		requireMarkup(
			renderToStaticMarkup(
				<CategoriesScreen
					autoLoad={false}
					initialState={{ status: "loading" }}
				/>,
			),
			"Cargando categorías",
		);
		requireMarkup(
			renderToStaticMarkup(
				<CategoriesScreen
					autoLoad={false}
					initialState={{ status: "success", categories: [] }}
				/>,
			),
			"Todavía no hay categorías",
		);
		requireMarkup(
			renderToStaticMarkup(
				<CategoriesScreen
					autoLoad={false}
					initialState={{ status: "error", errorMessage: "Falló" }}
				/>,
			),
			"Falló",
		);
	});

	it("renders populated category rows", async () => {
		const { default: CategoriesScreen } = await loadScreen();
		const populated = renderToStaticMarkup(
			<CategoriesScreen
				autoLoad={false}
				initialState={{
					status: "success",
					categories: [
						{
							id: 4,
							name: "Luz",
							colorApk: "warning",
							colorWeb: "primary",
							iconApk: "electricity",
							iconWeb: "electricity",
						},
						{
							id: 5,
							name: "Sin icono",
							colorApk: "warning",
							colorWeb: "danger",
							iconApk: "",
							iconWeb: "",
						},
					],
					page: 1,
					totalPages: 2,
					totalItems: 1,
				}}
			/>,
		);

		requireMarkup(populated, "Luz");
		requireMarkup(populated, "⚡");
		requireMarkup(populated, "Sin icono");
		requireMarkup(populated, "✓");
		requireMarkup(populated, "categories-color-primary");
		requireMarkup(populated, "Agregar categoría");
		requireMarkup(populated, "Editar Luz");
		requireMarkup(populated, "Eliminar Luz");
		requireMarkup(populated, "bg-transparent");
		requireMarkup(populated, "border-transparent");
		requireMarkup(populated, "text-primary");
		requireMarkup(populated, "hover:bg-primary/10");
		requireMarkup(populated, "text-destructive");
		requireMarkup(populated, "hover:bg-destructive/10");
		requireMarkup(populated, "focus-visible:outline-destructive");
		requireMarkup(populated, 'stroke="currentColor"');
		requireMarkup(populated, 'fill="none"');
		requireMarkup(populated, "Filas por página");
		requireMarkup(populated, 'value="10"');
		requireMarkup(populated, 'value="20"');
		requireMarkup(populated, 'value="25"');
		requireMarkup(populated, 'value="50"');
		expect(populated).not.toContain(">Editar<");
		expect(populated).not.toContain(">Eliminar<");
		requireMarkup(populated, "Página 1 de 2");
		expect(populated).not.toContain("Icono APK");
		expect(populated).not.toContain("Color APK");
		expect(populated).not.toContain("Primary");
	});

	it("renders legacy API colors with mapped theme token classes", async () => {
		const { default: CategoriesScreen } = await loadScreen();
		const markup = renderToStaticMarkup(
			<CategoriesScreen
				autoLoad={false}
				initialState={{
					status: "success",
					categories: [
						{
							id: 6,
							name: "Agua",
							colorApk: "success",
							colorWeb: "success",
							iconApk: "water",
							iconWeb: "water",
						},
						{
							id: 7,
							name: "Internet",
							colorApk: "info",
							colorWeb: "info",
							iconApk: "internet",
							iconWeb: "internet",
						},
					],
				}}
			/>,
		);

		requireMarkup(markup, "Agua");
		requireMarkup(markup, "categories-color-success");
		requireMarkup(markup, "text-success-foreground");
		requireMarkup(markup, "Internet");
		requireMarkup(markup, "categories-color-info");
		requireMarkup(markup, "text-info-foreground");
	});

	it("opens create modal with default visual options", async () => {
		const { default: CategoriesScreen, openCreateModal } = await loadScreen();
		const state = openCreateModal({ status: "success", categories: [] });
		const markup = renderToStaticMarkup(
			<CategoriesScreen autoLoad={false} initialState={state} />,
		);

		requireMarkup(markup, "Agregar categoría");
		requireMarkup(markup, "Crear categoría");
		requireMarkup(markup, "bg-warning");
		requireMarkup(markup, "categories-color-primary");
		requireMarkup(markup, "text-primary");
		requireMarkup(markup, "text-secondary");
		requireMarkup(markup, "text-success-foreground");
		requireMarkup(markup, "text-warning");
		requireMarkup(markup, "text-destructive");
		requireMarkup(markup, "text-info-foreground");
		requireMarkup(markup, "text-border");
		requireMarkup(markup, 'value="home"');
		expect(markup).not.toContain("Icono APK");
	});

	it("preloads edit modal and selector options", async () => {
		const { default: CategoriesScreen, openEditModal } = await loadScreen();
		const state = openEditModal(
			{
				status: "success",
				categories: [
					{
						id: 8,
						name: "Gas",
						colorApk: "danger",
						colorWeb: "warning",
						iconApk: "gas",
						iconWeb: "gas",
					},
				],
			},
			8,
		);
		const markup = renderToStaticMarkup(
			<CategoriesScreen autoLoad={false} initialState={state} />,
		);

		requireMarkup(markup, 'role="dialog"');
		requireMarkup(markup, "Editar categoría");
		requireMarkup(markup, 'value="Gas"');
		requireMarkup(markup, "bg-warning");
		requireMarkup(markup, 'name="icon_web"');
		requireMarkup(markup, 'value="gas"');
		requireMarkup(markup, "🔥");
		requireMarkup(markup, "categories-color-warning");
		requireMarkup(markup, 'name="color_web"');
		expect(markup).not.toContain("Icono APK");
		expect(markup).not.toContain("Color APK");
		expect(markup).not.toContain('name="icon_apk"');
		expect(markup).not.toContain('name="color_apk"');
	});

	it("renders mutation errors in the active edit dialog", async () => {
		const { default: CategoriesScreen, openEditModal } = await loadScreen();
		const state = openEditModal(
			{
				status: "success",
				errorMessage: "No pudimos actualizar la categoría.",
				categories: [
					{
						id: 4,
						name: "Luz",
						colorApk: "warning",
						colorWeb: "primary",
						iconApk: "electricity",
						iconWeb: "electricity",
					},
				],
			},
			4,
		);
		const markup = renderToStaticMarkup(
			<CategoriesScreen autoLoad={false} initialState={state} />,
		);

		requireMarkup(markup, "Editar categoría");
		requireMarkup(markup, "No pudimos actualizar la categoría.");
		requireMarkup(markup, "Luz");
	});

	it("renders mutation errors in the active delete dialog", async () => {
		const { default: CategoriesScreen, openDeleteConfirmation } =
			await loadScreen();
		const state = openDeleteConfirmation(
			{
				status: "success",
				errorMessage: "No pudimos eliminar la categoría.",
				categories: [
					{
						id: 4,
						name: "Luz",
						colorApk: "warning",
						colorWeb: "primary",
						iconApk: "electricity",
						iconWeb: "electricity",
					},
				],
			},
			4,
		);
		const markup = renderToStaticMarkup(
			<CategoriesScreen autoLoad={false} initialState={state} />,
		);

		requireMarkup(markup, "¿Eliminar Luz?");
		requireMarkup(markup, "No pudimos eliminar la categoría.");
	});

	it("requires delete confirmation before exposing the destructive action", async () => {
		const { default: CategoriesScreen, openDeleteConfirmation } =
			await loadScreen();
		const state = openDeleteConfirmation(
			{
				status: "success",
				categories: [
					{
						id: 2,
						name: "Seguro",
						colorApk: "info",
						colorWeb: "info",
						iconApk: "insurance",
						iconWeb: "insurance",
					},
				],
			},
			2,
		);
		const markup = renderToStaticMarkup(
			<CategoriesScreen autoLoad={false} initialState={state} />,
		);

		requireMarkup(markup, "¿Eliminar Seguro?");
		requireMarkup(markup, "bg-warning");
		requireMarkup(markup, "Sí, eliminar");
	});

	it("wires view actions for pagination, editing, and deletion", async () => {
		const {
			CategoriesView,
			createCategoriesState,
			openDeleteConfirmation,
			openEditModal,
		} = await loadScreen();
		const baseState = createCategoriesState({
			status: "success",
			categories: [
				{
					id: 1,
					name: "Luz",
					colorApk: "primary",
					colorWeb: "primary",
					iconApk: "electricity",
					iconWeb: "electricity",
				},
			],
			page: 2,
			totalPages: 3,
		});
		const state = openDeleteConfirmation(openEditModal(baseState, 1), 1);
		const handlers = {
			onPreviousPage: vi.fn(),
			onNextPage: vi.fn(),
			onPageSizeChange: vi.fn(),
			onOpenCreate: vi.fn(),
			onOpenEdit: vi.fn(),
			onOpenDelete: vi.fn(),
			onUpdateDraftField: vi.fn(),
			onSubmitEdit: vi.fn(),
			onCancelEdit: vi.fn(),
			onConfirmDelete: vi.fn(),
			onCancelDelete: vi.fn(),
		};
		const view = CategoriesView({ state, ...handlers });
		const elements = collectElements(view);
		const buttons = elements.filter((element) => element.type === "button");
		const dataTable = asElement(
			elements.find((element) => element.props.id === "categories-grid"),
		);
		const columns = dataTable.props.columns as {
			id?: string;
			cell?: unknown;
		}[];
		const actionsColumn = columns.find((column) => column.id === "actions");
		if (typeof actionsColumn?.cell !== "function") {
			throw new Error("Expected actions column to render cells");
		}
		const actionButtons = collectElements(
			actionsColumn.cell({ row: { original: baseState.categories[0] } }),
		).filter((element) => element.type === "button");

		for (const label of ["Agregar categoría", "Sí, eliminar"]) {
			const button = buttons.find((candidate) =>
				textFrom(candidate.props.children).includes(label),
			);
			callHandler(asElement(button).props.onClick);
		}
		const serverPagination = dataTable.props.serverPagination as Record<
			string,
			unknown
		>;
		callHandler(serverPagination.onPreviousPage);
		callHandler(serverPagination.onNextPage);
		callHandler(serverPagination.onPageSizeChange, 10);
		for (const ariaLabel of ["Editar Luz", "Eliminar Luz"]) {
			const button = actionButtons.find(
				(candidate) => candidate.props["aria-label"] === ariaLabel,
			);
			callHandler(asElement(button).props.onClick);
		}
		expect(
			actionButtons.find(
				(candidate) => candidate.props["aria-label"] === "Editar Luz",
			)?.props.className,
		).toContain("text-primary");
		expect(
			actionButtons.find(
				(candidate) => candidate.props["aria-label"] === "Editar Luz",
			)?.props.className,
		).toContain("bg-transparent");
		expect(
			actionButtons.find(
				(candidate) => candidate.props["aria-label"] === "Eliminar Luz",
			)?.props.className,
		).toContain("text-destructive");
		expect(
			actionButtons.find(
				(candidate) => candidate.props["aria-label"] === "Eliminar Luz",
			)?.props.className,
		).toContain("bg-transparent");
		for (const button of buttons.filter((candidate) =>
			textFrom(candidate.props.children).includes("Cancelar"),
		)) {
			callHandler(button.props.onClick);
		}
		const form = asElement(elements.find((element) => element.type === "form"));
		callHandler(form.props.onSubmit, { preventDefault: vi.fn() });
		for (const fieldName of ["name", "icon_web", "color_web"]) {
			const field = asElement(
				elements.find((element) => element.props.name === fieldName),
			);
			callHandler(field.props.onChange, { target: { value: "updated" } });
		}

		expect(handlers.onOpenCreate).toHaveBeenCalledOnce();
		expect(handlers.onOpenEdit).toHaveBeenCalledWith(1);
		expect(handlers.onOpenDelete).toHaveBeenCalledWith(1);
		expect(handlers.onPreviousPage).toHaveBeenCalledOnce();
		expect(handlers.onNextPage).toHaveBeenCalledOnce();
		expect(handlers.onPageSizeChange).toHaveBeenCalledWith(10);
		expect(handlers.onSubmitEdit).toHaveBeenCalledOnce();
		expect(handlers.onUpdateDraftField).toHaveBeenCalledTimes(3);
		expect(handlers.onConfirmDelete).toHaveBeenCalledOnce();
		expect(handlers.onCancelDelete).toHaveBeenCalledOnce();
	});

	it("normalizes state defaults", async () => {
		const { createCategoriesState, openCreateModal } = await loadScreen();

		expect(
			createCategoriesState({
				status: "success",
				categories: [
					{
						id: 5,
						name: "Casa",
						colorApk: "primary",
						colorWeb: "primary",
						iconApk: "home",
						iconWeb: "home",
					},
				],
			}),
		).toEqual(
			expect.objectContaining({
				page: 1,
				limit: 20,
				totalItems: 1,
				totalPages: 1,
			}),
		);
		expect(
			openCreateModal({ status: "success", categories: [] }).editDraft,
		).toEqual(
			expect.objectContaining({
				id: null,
				colorWeb: "primary",
				iconWeb: "home",
			}),
		);
	});

	it("handles no-op modal lookups safely", async () => {
		const { openDeleteConfirmation, openEditModal, removeDeletedCategory } =
			await loadScreen();

		expect(
			openEditModal({ status: "success", categories: [] }, 99).editDraft,
		).toBeNull();
		expect(
			openDeleteConfirmation({ status: "success", categories: [] }, 99)
				.deleteCandidate,
		).toBeNull();
		expect(
			removeDeletedCategory(
				{ status: "success", categories: [], totalItems: 0 },
				99,
			).totalItems,
		).toBe(0);
	});

	it("updates reducer state after edit and delete success", async () => {
		const { applyUpdatedCategory, removeDeletedCategory } = await loadScreen();
		const state = {
			status: "success" as const,
			categories: [
				{
					id: 1,
					name: "Vieja",
					colorApk: "primary",
					colorWeb: "primary",
					iconApk: "home",
					iconWeb: "home",
				},
				{
					id: 2,
					name: "Otra",
					colorApk: "info",
					colorWeb: "info",
					iconApk: "phone",
					iconWeb: "phone",
				},
			],
		};

		expect(
			applyUpdatedCategory(state, {
				id: 1,
				name: "Nueva",
				colorApk: "success",
				colorWeb: "success",
				iconApk: "water",
				iconWeb: "water",
			}),
		).toEqual(
			expect.objectContaining({
				categories: [
					expect.objectContaining({ name: "Nueva" }),
					expect.objectContaining({ id: 2 }),
				],
			}),
		);
		expect(removeDeletedCategory(state, 2)).toEqual(
			expect.objectContaining({
				categories: [expect.objectContaining({ id: 1 })],
			}),
		);
	});
});
