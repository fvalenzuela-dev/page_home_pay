import type { Dispatch, FormEventHandler } from "react";

import AppHeader from "../components/layout/AppHeader";
import Button from "../components/ui/Button";
import IconActionButton from "../components/ui/IconActionButton";
import {
	DataTable,
	DataTableColumnHeader,
	type ColumnDef,
} from "../components/ui/data-table/data-table";
import { cn } from "../lib/utils";
import {
	CATEGORY_COLOR_OPTIONS,
	CATEGORY_ICON_OPTIONS,
	type CategoryColor,
} from "./categoryOptions";
import type { Category, UpdateCategoryInput } from "./categoriesApi";
import {
	getCategoryIconDisplay,
	getColorClassName,
	getInputValue,
	type CategoriesState,
} from "./categoriesState";

export interface CategoriesViewProps {
	state: CategoriesState;
	onPreviousPage: () => void;
	onNextPage: () => void;
	onPageSizeChange: Dispatch<number>;
	onOpenCreate: () => void;
	onOpenEdit: Dispatch<number>;
	onOpenDelete: Dispatch<number>;
	onUpdateDraftField: Dispatch<{
		field: keyof UpdateCategoryInput;
		value: string;
	}>;
	onSubmitEdit: FormEventHandler<HTMLFormElement>;
	onCancelEdit: () => void;
	onConfirmDelete: () => void;
	onCancelDelete: () => void;
}

const categoriesShellClassName =
	"min-h-screen bg-[radial-gradient(circle_at_top_left,rgb(37_99_235_/_18%),transparent_28rem),linear-gradient(135deg,var(--surface),var(--surface-container-low))] p-4 text-[var(--on-surface)] transition-[background,color] duration-150 [--error-container:#ffdad6] [--error:#ba1a1a] [--on-primary:#ffffff] [--on-surface-variant:#434655] [--on-surface:#0b1c30] [--outline-variant:#c3c6d7] [--outline:#737686] [--primary-container:#2563eb] [--primary:#004ac6] [--secondary-container:#6cf8bb] [--secondary:#006c49] [--shadow:rgb(11_28_48_/_10%)] [--surface-container-high:#dce9ff] [--surface-container-low:#eff4ff] [--surface-container-lowest:#ffffff] [--surface-container:#e5eeff] [--surface-dim:#cbdbf5] [--surface:#f8f9ff] [color-scheme:light] [.dark_&]:[--error-container:#93000a] [.dark_&]:[--error:#ffb4ab] [.dark_&]:[--on-primary:#00174b] [.dark_&]:[--on-surface-variant:#c3c6d7] [.dark_&]:[--on-surface:#eaf1ff] [.dark_&]:[--outline-variant:#43556d] [.dark_&]:[--outline:#9ca3b4] [.dark_&]:[--primary-container:#2563eb] [.dark_&]:[--primary:#b4c5ff] [.dark_&]:[--secondary-container:#005236] [.dark_&]:[--secondary:#6ffbbe] [.dark_&]:[--shadow:rgb(0_0_0_/_28%)] [.dark_&]:[--surface-container-high:#2b3d55] [.dark_&]:[--surface-container-low:#182b44] [.dark_&]:[--surface-container-lowest:#13243a] [.dark_&]:[--surface-container:#213145] [.dark_&]:[--surface-dim:#213145] [.dark_&]:[--surface:#0b1c30] [.dark_&]:[color-scheme:dark] max-[560px]:p-3";

const heroSectionClassName =
	"mx-auto max-w-[1200px] pt-20 pb-8 max-[880px]:pt-8";
const heroCardClassName =
	"rounded-3xl border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-[clamp(2rem,5vw,4rem)]";
const eyebrowClassName =
	"m-0 text-xs leading-4 font-semibold tracking-[0.08em] text-[var(--on-surface-variant)] uppercase";
const heroTitleClassName =
	"mt-3 font-['Manrope',Inter,ui-sans-serif,system-ui,sans-serif] text-[clamp(2rem,5vw,4rem)] leading-[1.05] tracking-[-0.02em]";
const heroDescriptionClassName =
	"mt-6 max-w-[42rem] text-lg leading-[1.55] text-[var(--on-surface-variant)]";
const panelClassName =
	"mx-auto mb-12 max-w-[1200px] rounded-3xl border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-6";
const panelHeaderClassName =
	"mb-6 flex items-start justify-between gap-4 max-[640px]:grid max-[640px]:grid-cols-1";
const panelTitleClassName =
	"mt-2 font-['Manrope',Inter,ui-sans-serif,system-ui,sans-serif] text-[clamp(1.5rem,3vw,2rem)] leading-[1.15] tracking-[-0.02em]";
const panelDescriptionClassName =
	"mt-3 max-w-[36rem] text-sm leading-6 text-[var(--on-surface-variant)]";
const mutedTextClassName = "text-[var(--on-surface-variant)]";
const stateMessageClassName =
	"rounded-2xl border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-4 text-sm font-semibold text-[var(--on-surface-variant)]";
const errorMessageClassName =
	"rounded-2xl border border-[color-mix(in_srgb,var(--error)_35%,transparent)] bg-[color-mix(in_srgb,var(--error-container)_78%,transparent)] p-4 text-sm font-semibold text-[var(--error)]";
const iconPreviewBaseClassName =
	"inline-grid size-11 place-items-center rounded-2xl bg-[color-mix(in_srgb,currentColor_14%,var(--surface-container-lowest))] text-xl shadow-[inset_0_0_0_1px_color-mix(in_srgb,currentColor_28%,transparent)]";
const iconOptionPreviewClassName =
	"pointer-events-none absolute inset-px grid place-items-center rounded-[calc(1rem-1px)] bg-[color-mix(in_srgb,currentColor_14%,var(--surface-container-lowest))] text-xl";
const rowActionsClassName = "flex justify-end gap-2";
const modalBackdropClassName =
	"fixed inset-0 z-30 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm";
const modalClassName =
	"grid w-[min(100%,34rem)] gap-5 rounded-3xl border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-6 text-[var(--on-surface)] shadow-[0_1.5rem_4rem_rgb(0_0_0_/_24%)]";
const modalTitleClassName =
	"font-['Manrope',Inter,ui-sans-serif,system-ui,sans-serif] text-2xl leading-tight font-extrabold tracking-[-0.02em]";
const fieldLabelClassName = "grid gap-2 text-sm font-bold";
const fieldInputClassName =
	"min-h-12 rounded-2xl border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-4 py-3 text-base text-[var(--on-surface)] outline-none transition-[border-color,box-shadow] duration-150 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--primary)_18%,transparent)]";
const choiceGroupClassName = "grid gap-3 border-0 p-0";
const choiceLegendClassName = "text-sm font-bold text-[var(--on-surface)]";
const iconOptionsClassName =
	"grid grid-cols-[repeat(auto-fit,minmax(3rem,1fr))] gap-2";
const colorOptionsClassName =
	"grid grid-cols-[repeat(auto-fit,minmax(3rem,1fr))] gap-2";
const choiceClassName =
	"relative grid min-h-12 cursor-pointer place-items-center rounded-2xl border border-[var(--outline-variant)] bg-[var(--surface-container-low)] transition-[border-color,box-shadow,transform] duration-150 hover:-translate-y-px hover:border-[var(--primary)] has-[:focus-visible]:border-[var(--primary)] has-[:focus-visible]:shadow-[0_0_0_4px_color-mix(in_srgb,var(--primary)_18%,transparent)] has-[:checked]:border-[var(--primary)] has-[:checked]:bg-[color-mix(in_srgb,var(--primary)_10%,var(--surface-container-lowest))]";
const colorSwatchBaseClassName =
	"inline-block size-7 rounded-full bg-current shadow-[0_0_0_5px_color-mix(in_srgb,currentColor_16%,transparent)]";
const modalActionsClassName =
	"flex justify-end gap-3 pt-2 max-[480px]:grid max-[480px]:grid-cols-1";

const CATEGORY_COLOR_CLASS_NAMES: Record<CategoryColor, string> = {
	primary: "text-primary",
	secondary: "text-secondary",
	success: "text-success-foreground",
	danger: "text-destructive",
	warning: "text-warning",
	info: "text-info-foreground",
	neutral: "text-border",
};

function getCategoryColorClassName(color: string) {
	return cn(
		getColorClassName(color),
		CATEGORY_COLOR_CLASS_NAMES[color as CategoryColor],
	);
}

function TrashIcon() {
	return (
		<svg
			aria-hidden="true"
			className="size-5"
			fill="none"
			focusable="false"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			viewBox="0 0 24 24"
		>
			<path d="M3 6h18" />
			<path d="M8 6V4h8v2" />
			<path d="M6 6l1 15h10l1-15" />
			<path d="M10 11v6" />
			<path d="M14 11v6" />
		</svg>
	);
}

function CategoryIcon({ category }: { category: Category }) {
	const iconDisplay = getCategoryIconDisplay(category);

	return (
		<span
			className={cn(
				iconPreviewBaseClassName,
				getCategoryColorClassName(iconDisplay.color),
			)}
			aria-label={`${category.name} icono`}
			role="img"
		>
			{iconDisplay.glyph}
		</span>
	);
}

function createCategoryColumns(
	onOpenEdit: Dispatch<number>,
	onOpenDelete: Dispatch<number>,
): ColumnDef<Category>[] {
	return [
		{
			id: "icon",
			header: () => <span>Icono</span>,
			enableSorting: false,
			cell: ({ row }) => <CategoryIcon category={row.original} />,
		},
		{
			accessorKey: "name",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Nombre" />
			),
			cell: ({ row }) => (
				<span className="font-semibold">{row.original.name}</span>
			),
		},
		{
			id: "actions",
			header: () => <span>Acciones</span>,
			enableSorting: false,
			cell: ({ row }) => (
				<div className={rowActionsClassName}>
					<IconActionButton
						icon="✎"
						variant="primary-ghost"
						aria-label={`Editar ${row.original.name}`}
						onClick={() => {
							onOpenEdit(row.original.id);
						}}
					/>
					<IconActionButton
						icon={<TrashIcon />}
						variant="danger-ghost"
						aria-label={`Eliminar ${row.original.name}`}
						onClick={() => {
							onOpenDelete(row.original.id);
						}}
					/>
				</div>
			),
		},
	];
}

function ErrorMessage({ message }: { message: string | null }) {
	return message === null ? null : (
		<p className={errorMessageClassName} role="alert">
			{message}
		</p>
	);
}

function CategoryNameField(
	props: Pick<CategoriesViewProps, "state" | "onUpdateDraftField">,
) {
	return (
		<label className={fieldLabelClassName} htmlFor="category-name">
			<span>Nombre</span>
			<input
				className={fieldInputClassName}
				id="category-name"
				name="name"
				required
				value={props.state.editDraft?.name ?? ""}
				onChange={(event) => {
					props.onUpdateDraftField({
						field: "name",
						value: getInputValue(event),
					});
				}}
			/>
		</label>
	);
}

function EditDialogActions(
	props: Pick<CategoriesViewProps, "state" | "onCancelEdit">,
) {
	return (
		<div className={modalActionsClassName}>
			<Button
				variant="warning"
				size="md"
				type="button"
				onClick={props.onCancelEdit}
			>
				Cancelar
			</Button>
			<Button size="md" type="submit">
				{props.state.editDraft?.id === null
					? "Crear categoría"
					: "Guardar cambios"}
			</Button>
		</div>
	);
}

function EditDialog(
	props: Pick<
		CategoriesViewProps,
		"state" | "onUpdateDraftField" | "onSubmitEdit" | "onCancelEdit"
	>,
) {
	if (props.state.editDraft === null) {
		return null;
	}

	return (
		<div className={modalBackdropClassName} role="presentation">
			<form
				className={modalClassName}
				aria-label="Editar categoría"
				aria-modal="true"
				role="dialog"
				onSubmit={props.onSubmitEdit}
			>
				<h2 className={modalTitleClassName}>
					{props.state.editDraft.id === null
						? "Agregar categoría"
						: "Editar categoría"}
				</h2>
				<ErrorMessage message={props.state.errorMessage} />
				<CategoryNameField {...props} />
				<IconOptions {...props} />
				<ColorOptions {...props} />
				<EditDialogActions {...props} />
			</form>
		</div>
	);
}

function IconOptions(
	props: Pick<CategoriesViewProps, "state" | "onUpdateDraftField">,
) {
	return (
		<fieldset className={choiceGroupClassName}>
			<legend className={choiceLegendClassName}>Icono</legend>
			<div className={iconOptionsClassName}>
				{CATEGORY_ICON_OPTIONS.map((option) => (
					<label className={choiceClassName} key={option.value}>
						<span className="sr-only">{option.label}</span>
						<input
							className="sr-only"
							checked={props.state.editDraft?.iconWeb === option.value}
							name="icon_web"
							type="radio"
							value={option.value}
							onChange={(event) => {
								props.onUpdateDraftField({
									field: "iconWeb",
									value: getInputValue(event),
								});
							}}
						/>
						<span
							className={cn(
								iconOptionPreviewClassName,
								getCategoryColorClassName(
									props.state.editDraft?.colorWeb ?? "primary",
								),
							)}
							aria-hidden="true"
						>
							{option.glyph}
						</span>
					</label>
				))}
			</div>
		</fieldset>
	);
}

function ColorOptions(
	props: Pick<CategoriesViewProps, "state" | "onUpdateDraftField">,
) {
	return (
		<fieldset className={choiceGroupClassName}>
			<legend className={choiceLegendClassName}>Color</legend>
			<div className={colorOptionsClassName}>
				{CATEGORY_COLOR_OPTIONS.map((option) => (
					<label className={choiceClassName} key={option.value}>
						<span className="sr-only">{option.label}</span>
						<input
							className="sr-only"
							checked={props.state.editDraft?.colorWeb === option.value}
							name="color_web"
							type="radio"
							value={option.value}
							onChange={(event) => {
								props.onUpdateDraftField({
									field: "colorWeb",
									value: getInputValue(event),
								});
							}}
						/>
						<span
							className={cn(
								colorSwatchBaseClassName,
								getCategoryColorClassName(option.value),
							)}
							aria-hidden="true"
						/>
					</label>
				))}
			</div>
		</fieldset>
	);
}

function DeleteDialog(
	props: Pick<
		CategoriesViewProps,
		"state" | "onConfirmDelete" | "onCancelDelete"
	>,
) {
	if (props.state.deleteCandidate === null) {
		return null;
	}

	return (
		<div className={modalBackdropClassName} role="presentation">
			<section
				className={modalClassName}
				aria-label="Confirmar eliminación"
				aria-modal="true"
				role="dialog"
			>
				<h2 className={modalTitleClassName}>
					¿Eliminar {props.state.deleteCandidate.name}?
				</h2>
				<p className={mutedTextClassName}>
					Esta acción elimina la categoría seleccionada después de confirmar.
				</p>
				{props.state.errorMessage !== null && (
					<p className={errorMessageClassName} role="alert">
						{props.state.errorMessage}
					</p>
				)}
				<div className={modalActionsClassName}>
					<Button
						variant="warning"
						size="md"
						type="button"
						onClick={props.onCancelDelete}
					>
						Cancelar
					</Button>
					<Button
						variant="danger"
						size="md"
						type="button"
						onClick={props.onConfirmDelete}
					>
						Sí, eliminar
					</Button>
				</div>
			</section>
		</div>
	);
}

function CategoriesPanelHeader(
	props: Pick<CategoriesViewProps, "state" | "onOpenCreate">,
) {
	return (
		<div className={panelHeaderClassName}>
			<div>
				<p className={eyebrowClassName}>Endpoint /categories</p>
				<h2 className={panelTitleClassName}>Categorías</h2>
				<p className={panelDescriptionClassName}>
					Listado paginado para administrar las categorías de pagos y facturas.
				</p>
			</div>
			<div className="flex items-center gap-3 max-[640px]:grid max-[640px]:grid-cols-1">
				<span className="rounded-full bg-[color-mix(in_srgb,#006a6a_14%,transparent)] px-3 py-1.5 text-sm font-bold text-[#006a6a]">
					{props.state.totalItems} categorías
				</span>
				<Button size="md" type="button" onClick={props.onOpenCreate}>
					Agregar categoría
				</Button>
			</div>
		</div>
	);
}

function CategoriesPanelBody(
	props: Pick<
		CategoriesViewProps,
		| "state"
		| "onOpenEdit"
		| "onOpenDelete"
		| "onPreviousPage"
		| "onNextPage"
		| "onPageSizeChange"
	>,
) {
	const columns = createCategoryColumns(props.onOpenEdit, props.onOpenDelete);

	return (
		<>
			{props.state.status === "loading" && (
				<p className={stateMessageClassName}>Cargando categorías…</p>
			)}
			<ErrorMessage message={props.state.errorMessage} />
			{props.state.status === "success" &&
				props.state.categories.length === 0 && (
					<p className={stateMessageClassName}>Todavía no hay categorías.</p>
				)}
			{props.state.status === "success" &&
				props.state.categories.length > 0 && (
					<DataTable
						id="categories-grid"
						eyebrow="Registros"
						title="Categorías disponibles"
						data={props.state.categories}
						columns={columns}
						getRowId={(category) => category.id}
						searchColumnIds={["name"]}
						searchPlaceholder="Buscar categorías..."
						initialPageSize={props.state.limit}
						pageSizeOptions={[10, 20, 25, 50]}
						totalSummary={(total) => `${total} visibles`}
						paginationLabel="Paginación de categorías"
						serverPagination={{
							page: props.state.page,
							pageSize: props.state.limit,
							totalPages: props.state.totalPages,
							canPreviousPage: props.state.page > 1,
							canNextPage: props.state.page < props.state.totalPages,
							onPreviousPage: props.onPreviousPage,
							onNextPage: props.onNextPage,
							onPageSizeChange: props.onPageSizeChange,
						}}
					/>
				)}
		</>
	);
}

function CategoriesPanel(props: CategoriesViewProps) {
	return (
		<section className={panelClassName} aria-label="Listado de categorías">
			<CategoriesPanelHeader
				state={props.state}
				onOpenCreate={props.onOpenCreate}
			/>
			<CategoriesPanelBody
				state={props.state}
				onOpenEdit={props.onOpenEdit}
				onOpenDelete={props.onOpenDelete}
				onPreviousPage={props.onPreviousPage}
				onNextPage={props.onNextPage}
				onPageSizeChange={props.onPageSizeChange}
			/>
		</section>
	);
}

export function CategoriesView(props: CategoriesViewProps) {
	return (
		<main className={categoriesShellClassName}>
			<AppHeader homeHrefPrefix="/" />
			<section
				className={heroSectionClassName}
				aria-labelledby="categories-title"
			>
				<div className={heroCardClassName}>
					<p className={eyebrowClassName}>Administración</p>
					<h1 className={heroTitleClassName} id="categories-title">
						Categorías
					</h1>
					<p className={heroDescriptionClassName}>
						Gestioná categorías de pagos y facturas con íconos y colores del
						sistema.
					</p>
				</div>
			</section>

			<CategoriesPanel {...props} />
			<EditDialog
				state={props.state}
				onUpdateDraftField={props.onUpdateDraftField}
				onSubmitEdit={props.onSubmitEdit}
				onCancelEdit={props.onCancelEdit}
			/>
			<DeleteDialog
				state={props.state}
				onConfirmDelete={props.onConfirmDelete}
				onCancelDelete={props.onCancelDelete}
			/>
		</main>
	);
}
