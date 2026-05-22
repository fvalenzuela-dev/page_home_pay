import type { Dispatch, FormEventHandler } from "react";

import AppHeader from "../components/layout/AppHeader";
import Button from "../components/ui/Button";
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
	"min-h-screen bg-[radial-gradient(circle_at_top_left,rgb(37_99_235_/_18%),transparent_28rem),linear-gradient(135deg,var(--surface),var(--surface-container-low))] p-4 text-[var(--on-surface)] transition-[background,color] duration-150 [--error-container:#ffdad6] [--error:#ba1a1a] [--on-primary:#ffffff] [--on-surface-variant:#434655] [--on-surface:#0b1c30] [--outline-variant:#c3c6d7] [--outline:#737686] [--primary-container:#2563eb] [--primary:#004ac6] [--secondary-container:#6cf8bb] [--secondary:#006c49] [--shadow:rgb(11_28_48_/_10%)] [--surface-container-high:#dce9ff] [--surface-container-low:#eff4ff] [--surface-container-lowest:#ffffff] [--surface-container:#e5eeff] [--surface-dim:#cbdbf5] [--surface:#f8f9ff] [color-scheme:light] has-[#theme-switch:checked]:[--error-container:#93000a] has-[#theme-switch:checked]:[--error:#ffb4ab] has-[#theme-switch:checked]:[--on-primary:#00174b] has-[#theme-switch:checked]:[--on-surface-variant:#c3c6d7] has-[#theme-switch:checked]:[--on-surface:#eaf1ff] has-[#theme-switch:checked]:[--outline-variant:#43556d] has-[#theme-switch:checked]:[--outline:#9ca3b4] has-[#theme-switch:checked]:[--primary-container:#2563eb] has-[#theme-switch:checked]:[--primary:#b4c5ff] has-[#theme-switch:checked]:[--secondary-container:#005236] has-[#theme-switch:checked]:[--secondary:#6ffbbe] has-[#theme-switch:checked]:[--shadow:rgb(0_0_0_/_28%)] has-[#theme-switch:checked]:[--surface-container-high:#2b3d55] has-[#theme-switch:checked]:[--surface-container-low:#182b44] has-[#theme-switch:checked]:[--surface-container-lowest:#13243a] has-[#theme-switch:checked]:[--surface-container:#213145] has-[#theme-switch:checked]:[--surface-dim:#213145] has-[#theme-switch:checked]:[--surface:#0b1c30] has-[#theme-switch:checked]:[color-scheme:dark] max-[560px]:p-3";

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
const mutedTextClassName = "text-[var(--on-surface-variant)]";
const stateMessageClassName =
	"rounded-2xl border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-4 text-sm font-semibold text-[var(--on-surface-variant)]";
const errorMessageClassName =
	"rounded-2xl border border-[color-mix(in_srgb,var(--error)_35%,transparent)] bg-[color-mix(in_srgb,var(--error-container)_78%,transparent)] p-4 text-sm font-semibold text-[var(--error)]";
const successMessageClassName =
	"rounded-2xl border border-[color-mix(in_srgb,var(--secondary)_35%,transparent)] bg-[color-mix(in_srgb,var(--secondary-container)_42%,transparent)] p-4 text-sm font-semibold text-[var(--secondary)]";
const iconPreviewBaseClassName =
	"inline-grid size-11 place-items-center rounded-2xl bg-[color-mix(in_srgb,currentColor_14%,var(--surface-container-lowest))] text-xl shadow-[inset_0_0_0_1px_color-mix(in_srgb,currentColor_28%,transparent)]";
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
	primary: "text-[var(--primary)]",
	secondary: "text-[var(--secondary)]",
	success: "text-[var(--secondary)]",
	danger: "text-[var(--error)]",
	warning: "text-[#b26a00]",
	info: "text-[#006a6a]",
	neutral: "text-[var(--outline)]",
};

function getCategoryColorClassName(color: string) {
	return cn(
		getColorClassName(color),
		CATEGORY_COLOR_CLASS_NAMES[color as CategoryColor] ??
			CATEGORY_COLOR_CLASS_NAMES.neutral,
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
			cell: ({ row }) => <span className="font-semibold">{row.original.name}</span>,
		},
		{
			id: "actions",
			header: () => <span>Acciones</span>,
			enableSorting: false,
			cell: ({ row }) => (
				<div className={rowActionsClassName}>
					<Button
						className="rounded-full"
						variant="outline"
						size="icon"
						aria-label={`Editar ${row.original.name}`}
						onClick={() => {
							onOpenEdit(row.original.id);
						}}
					>
						<span aria-hidden="true">✎</span>
					</Button>
					<Button
						className="rounded-full"
						variant="danger"
						size="icon"
						aria-label={`Eliminar ${row.original.name}`}
						onClick={() => {
							onOpenDelete(row.original.id);
						}}
					>
						<span aria-hidden="true">🗑</span>
					</Button>
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
				variant="outline"
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
								iconPreviewBaseClassName,
								getCategoryColorClassName(
									props.state.editDraft?.colorWeb ?? "success",
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
						variant="outline"
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
				<h2 className={panelTitleClassName}>Listado paginado</h2>
			</div>
			<div className="flex items-center gap-3 max-[640px]:grid max-[640px]:grid-cols-1">
				<span className="rounded-full bg-[color-mix(in_srgb,#006a6a_14%,transparent)] px-3 py-1.5 text-sm font-bold text-[#006a6a]">
					{props.state.totalItems} categorías
				</span>
				<Button
					size="md"
					type="button"
					onClick={props.onOpenCreate}
				>
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
			{props.state.successMessage !== null && (
				<p className={successMessageClassName} role="status">
					{props.state.successMessage}
				</p>
			)}
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
						eyebrow="Endpoint /categories"
						title="Listado paginado"
						data={props.state.categories}
						columns={columns}
						getRowId={(category) => category.id}
						searchColumnIds={["name"]}
						searchPlaceholder="Buscar categorías..."
						initialPageSize={props.state.limit}
						pageSizeOptions={[10, 20, 25, 50]}
						totalSummary={() => `${props.state.totalItems} categorías`}
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
		<section
			className={panelClassName}
			aria-label="Listado de categorías"
		>
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
			<section className={heroSectionClassName} aria-labelledby="categories-title">
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
