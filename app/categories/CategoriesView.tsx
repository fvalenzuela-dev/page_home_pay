import type { FormEvent } from "react";

import AppHeader from "../AppHeader";
import {
	CATEGORY_COLOR_OPTIONS,
	CATEGORY_ICON_OPTIONS,
} from "./categoryOptions";
import type { Category, UpdateCategoryInput } from "./categoriesApi";
import {
	getCategoryIconDisplay,
	getColorClassName,
	getInputValue,
	type CategoriesState,
} from "./categoriesState";

interface CategoriesViewProps {
	state: CategoriesState;
	onPreviousPage: () => void;
	onNextPage: () => void;
	onOpenCreate: () => void;
	onOpenEdit: (categoryId: number) => void;
	onOpenDelete: (categoryId: number) => void;
	onUpdateDraftField: (
		categoryField: keyof UpdateCategoryInput,
		fieldValue: string,
	) => void;
	onSubmitEdit: (formEvent: FormEvent<HTMLFormElement>) => void;
	onCancelEdit: () => void;
	onConfirmDelete: () => void;
	onCancelDelete: () => void;
}

interface CategoriesTableProps {
	categories: Category[];
	onOpenEdit: (categoryId: number) => void;
	onOpenDelete: (categoryId: number) => void;
}

interface CategoryRowProps {
	category: Category;
	onOpenEdit: (categoryId: number) => void;
	onOpenDelete: (categoryId: number) => void;
}

function CategoryRow({ category, onOpenEdit, onOpenDelete }: CategoryRowProps) {
	const iconDisplay = getCategoryIconDisplay(category);

	return (
		<tr>
			<td className="categories-icon-cell">
				<span
					className={`categories-icon-preview ${getColorClassName(iconDisplay.color)}`}
					aria-label={`${category.name} icono`}
					role="img"
				>
					{iconDisplay.glyph}
				</span>
			</td>
			<td>{category.name}</td>
			<td>
				<div className="categories-row-actions">
					<button
						className="categories-icon-button categories-edit-button"
						type="button"
						aria-label={`Editar ${category.name}`}
						onClick={() => {
							onOpenEdit(category.id);
						}}
					>
						<span aria-hidden="true">✎</span>
					</button>
					<button
						className="categories-icon-button categories-danger-button"
						type="button"
						aria-label={`Eliminar ${category.name}`}
						onClick={() => {
							onOpenDelete(category.id);
						}}
					>
						<span aria-hidden="true">🗑</span>
					</button>
				</div>
			</td>
		</tr>
	);
}

function CategoriesTable(props: CategoriesTableProps) {
	return (
		<div className="categories-table-wrap">
			<table className="categories-table">
				<thead>
					<tr>
						<th aria-label="Icono" />
						<th>Nombre</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					{props.categories.map((category) => (
						<CategoryRow
							category={category}
							key={category.id}
							onOpenEdit={props.onOpenEdit}
							onOpenDelete={props.onOpenDelete}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
}

function CategoriesPagination(
	props: Pick<CategoriesViewProps, "state" | "onPreviousPage" | "onNextPage">,
) {
	return (
		<nav
			className="categories-pagination"
			aria-label="Paginación de categorías"
		>
			<button
				type="button"
				disabled={props.state.page <= 1}
				onClick={props.onPreviousPage}
			>
				Anterior
			</button>
			<span>
				{" "}
				Página {props.state.page} de {props.state.totalPages}{" "}
			</span>
			<button
				type="button"
				disabled={props.state.page >= props.state.totalPages}
				onClick={props.onNextPage}
			>
				Siguiente
			</button>
		</nav>
	);
}

function ErrorMessage({ message }: { message: string | null }) {
	return message === null ? null : (
		<p className="categories-error" role="alert">
			{message}
		</p>
	);
}

function CategoryNameField(
	props: Pick<CategoriesViewProps, "state" | "onUpdateDraftField">,
) {
	return (
		<label className="auth-field" htmlFor="category-name">
			<span>Nombre</span>
			<input
				id="category-name"
				name="name"
				required
				value={props.state.editDraft?.name ?? ""}
				onChange={(event) => {
					props.onUpdateDraftField("name", getInputValue(event));
				}}
			/>
		</label>
	);
}

function EditDialogActions(
	props: Pick<CategoriesViewProps, "state" | "onCancelEdit">,
) {
	return (
		<div className="categories-modal-actions">
			<button type="button" onClick={props.onCancelEdit}>
				Cancelar
			</button>
			<button className="auth-submit-button" type="submit">
				{props.state.editDraft?.id === null
					? "Crear categoría"
					: "Guardar cambios"}
			</button>
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
		<div className="categories-modal-backdrop" role="presentation">
			<form
				className="categories-modal"
				aria-label="Editar categoría"
				aria-modal="true"
				role="dialog"
				onSubmit={props.onSubmitEdit}
			>
				<h2>
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
		<fieldset className="categories-choice-group">
			<legend>Icono</legend>
			<div className="categories-icon-options">
				{CATEGORY_ICON_OPTIONS.map((option) => (
					<label className="categories-choice" key={option.value}>
						<span className="sr-only">{option.label}</span>
						<input
							checked={props.state.editDraft?.iconWeb === option.value}
							name="icon_web"
							type="radio"
							value={option.value}
							onChange={(event) => {
								props.onUpdateDraftField("iconWeb", getInputValue(event));
							}}
						/>
						<span
							className={`categories-icon-preview ${getColorClassName(props.state.editDraft?.colorWeb ?? "success")}`}
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
		<fieldset className="categories-choice-group">
			<legend>Color</legend>
			<div className="categories-color-options">
				{CATEGORY_COLOR_OPTIONS.map((option) => (
					<label className="categories-choice" key={option.value}>
						<span className="sr-only">{option.label}</span>
						<input
							checked={props.state.editDraft?.colorWeb === option.value}
							name="color_web"
							type="radio"
							value={option.value}
							onChange={(event) => {
								props.onUpdateDraftField("colorWeb", getInputValue(event));
							}}
						/>
						<span
							className={`categories-color-swatch ${getColorClassName(option.value)}`}
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
		<div className="categories-modal-backdrop" role="presentation">
			<section
				className="categories-modal"
				aria-label="Confirmar eliminación"
				aria-modal="true"
				role="dialog"
			>
				<h2>¿Eliminar {props.state.deleteCandidate.name}?</h2>
				<p>
					Esta acción elimina la categoría seleccionada después de confirmar.
				</p>
				{props.state.errorMessage !== null && (
					<p className="categories-error" role="alert">
						{props.state.errorMessage}
					</p>
				)}
				<div className="categories-modal-actions">
					<button type="button" onClick={props.onCancelDelete}>
						Cancelar
					</button>
					<button
						className="categories-danger-button"
						type="button"
						onClick={props.onConfirmDelete}
					>
						Sí, eliminar
					</button>
				</div>
			</section>
		</div>
	);
}

function CategoriesPanel(props: CategoriesViewProps) {
	return (
		<section
			className="panel categories-panel"
			aria-label="Listado de categorías"
		>
			<div className="panel-header">
				<div>
					<p className="card-label">Endpoint /categories</p>
					<h2>Listado paginado</h2>
				</div>
				<div className="categories-panel-actions">
					<span className="status-chip info">
						{props.state.totalItems} categorías
					</span>
					<button
						className="auth-submit-button categories-add-button"
						type="button"
						onClick={props.onOpenCreate}
					>
						Agregar categoría
					</button>
				</div>
			</div>

			{props.state.successMessage !== null && (
				<p className="categories-success" role="status">
					{props.state.successMessage}
				</p>
			)}
			{props.state.status === "loading" && (
				<p className="categories-state">Cargando categorías…</p>
			)}
			<ErrorMessage message={props.state.errorMessage} />
			{props.state.status === "success" &&
				props.state.categories.length === 0 && (
					<p className="categories-state">Todavía no hay categorías.</p>
				)}
			{props.state.status === "success" &&
				props.state.categories.length > 0 && (
					<CategoriesTable
						categories={props.state.categories}
						onOpenEdit={props.onOpenEdit}
						onOpenDelete={props.onOpenDelete}
					/>
				)}

			<CategoriesPagination
				state={props.state}
				onPreviousPage={props.onPreviousPage}
				onNextPage={props.onNextPage}
			/>
		</section>
	);
}

export function CategoriesView(props: CategoriesViewProps) {
	return (
		<main className="app-shell categories-shell">
			<AppHeader homeHrefPrefix="/" />
			<section className="categories-hero" aria-labelledby="categories-title">
				<div>
					<p className="eyebrow">Administración</p>
					<h1 id="categories-title">Categorías</h1>
					<p>
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
