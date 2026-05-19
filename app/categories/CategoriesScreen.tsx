"use client";

import { useAuth } from "@clerk/nextjs";
import {
	useEffect,
	useMemo,
	useState,
	type ChangeEvent,
	type FormEvent,
} from "react";

import AppHeader from "../AppHeader";
import {
	CATEGORY_COLOR_OPTIONS,
	CATEGORY_ICON_OPTIONS,
	getCategoryIconGlyph,
} from "./categoryOptions";
import {
	createCategoriesApi,
	type Category,
	type UpdateCategoryInput,
} from "./categoriesApi";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

export interface CategoriesState {
	status: "loading" | "error" | "success";
	categories: Category[];
	page: number;
	limit: number;
	totalItems: number;
	totalPages: number;
	errorMessage: string | null;
	successMessage: string | null;
	editDraft: (UpdateCategoryInput & { id: number | null }) | null;
	deleteCandidate: Category | null;
}

type PartialInitialState = Partial<CategoriesState> & {
	status: CategoriesState["status"];
};

export interface CategoriesScreenProps {
	autoLoad?: boolean;
	initialState?: PartialInitialState;
}

export function createCategoriesState(
	overrides: PartialInitialState = { status: "loading" },
): CategoriesState {
	return {
		status: overrides.status,
		categories: overrides.categories ?? [],
		page: overrides.page ?? DEFAULT_PAGE,
		limit: overrides.limit ?? DEFAULT_LIMIT,
		totalItems: overrides.totalItems ?? overrides.categories?.length ?? 0,
		totalPages: overrides.totalPages ?? 1,
		errorMessage: overrides.errorMessage ?? null,
		successMessage: overrides.successMessage ?? null,
		editDraft: overrides.editDraft ?? null,
		deleteCandidate: overrides.deleteCandidate ?? null,
	};
}

function findCategory(
	state: CategoriesState | PartialInitialState,
	id: number,
) {
	return state.categories?.find((category) => category.id === id) ?? null;
}

export function openCreateModal(
	state: CategoriesState | PartialInitialState,
): CategoriesState {
	return {
		...createCategoriesState(state),
		editDraft: {
			id: null,
			name: "",
			colorApk: "success",
			colorWeb: "success",
			iconApk: "home",
			iconWeb: "home",
		},
		errorMessage: null,
	};
}

export function openEditModal(
	state: CategoriesState | PartialInitialState,
	id: number,
): CategoriesState {
	const normalizedState = createCategoriesState(state);
	const category = findCategory(normalizedState, id);

	return {
		...normalizedState,
		editDraft:
			category === null
				? null
				: {
						id: category.id,
						name: category.name,
						colorApk: category.colorApk,
						colorWeb: category.colorWeb,
						iconApk: category.iconApk,
						iconWeb: category.iconWeb,
					},
	};
}

export function openDeleteConfirmation(
	state: CategoriesState | PartialInitialState,
	id: number,
): CategoriesState {
	const normalizedState = createCategoriesState(state);

	return {
		...normalizedState,
		deleteCandidate: findCategory(normalizedState, id),
	};
}

export function applyUpdatedCategory(
	state: CategoriesState | PartialInitialState,
	updatedCategory: Category,
): CategoriesState {
	const normalizedState = createCategoriesState(state);

	return {
		...normalizedState,
		categories: normalizedState.categories.map((category) =>
			category.id === updatedCategory.id ? updatedCategory : category,
		),
		editDraft: null,
		successMessage: "Categoría actualizada.",
	};
}

export function removeDeletedCategory(
	state: CategoriesState | PartialInitialState,
	id: number,
): CategoriesState {
	const normalizedState = createCategoriesState(state);

	return {
		...normalizedState,
		categories: normalizedState.categories.filter(
			(category) => category.id !== id,
		),
		deleteCandidate: null,
		totalItems: Math.max(0, normalizedState.totalItems - 1),
		successMessage: "Categoría eliminada.",
	};
}

function getInputValue(event: ChangeEvent<HTMLInputElement>) {
	return event.target.value;
}

function getColorClassName(color: string) {
	return `categories-color-${color}`;
}

function getCategoryIconDisplay(category: Category) {
	const glyph = getCategoryIconGlyph(category.iconWeb);
	return {
		glyph: glyph === "•" ? "✓" : glyph,
		color: glyph === "•" ? "success" : category.colorWeb,
	};
}

interface CategoriesViewProps {
	state: CategoriesState;
	onPreviousPage: () => void;
	onNextPage: () => void;
	onOpenCreate: () => void;
	onOpenEdit: (id: number) => void;
	onOpenDelete: (id: number) => void;
	onUpdateDraftField: (field: keyof UpdateCategoryInput, value: string) => void;
	onSubmitEdit: (event: FormEvent<HTMLFormElement>) => void;
	onCancelEdit: () => void;
	onConfirmDelete: () => void;
	onCancelDelete: () => void;
}

export function CategoriesView({
	state,
	onPreviousPage,
	onNextPage,
	onOpenCreate,
	onOpenEdit,
	onOpenDelete,
	onUpdateDraftField,
	onSubmitEdit,
	onCancelEdit,
	onConfirmDelete,
	onCancelDelete,
}: CategoriesViewProps) {
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
							{state.totalItems} categorías
						</span>
						<button
							className="auth-submit-button categories-add-button"
							type="button"
							onClick={onOpenCreate}
						>
							Agregar categoría
						</button>
					</div>
				</div>

				{state.successMessage !== null && (
					<p className="categories-success" role="status">
						{state.successMessage}
					</p>
				)}

				{state.status === "loading" && (
					<p className="categories-state">Cargando categorías…</p>
				)}

				{state.errorMessage !== null && (
					<p className="categories-error" role="alert">
						{state.errorMessage}
					</p>
				)}

				{state.status === "success" && state.categories.length === 0 && (
					<p className="categories-state">Todavía no hay categorías.</p>
				)}

				{state.status === "success" && state.categories.length > 0 && (
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
								{state.categories.map((category) => {
									const iconDisplay = getCategoryIconDisplay(category);
									return (
										<tr key={category.id}>
											<td className="categories-icon-cell">
												<span
													className={`categories-icon-preview ${getColorClassName(iconDisplay.color)}`}
													aria-label={`${category.name} icono`}
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
														onClick={() => onOpenEdit(category.id)}
													>
														<span aria-hidden="true">✎</span>
													</button>
													<button
														className="categories-icon-button categories-danger-button"
														type="button"
														aria-label={`Eliminar ${category.name}`}
														onClick={() => onOpenDelete(category.id)}
													>
														<span aria-hidden="true">🗑</span>
													</button>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}

				<nav
					className="categories-pagination"
					aria-label="Paginación de categorías"
				>
					<button
						type="button"
						disabled={state.page <= 1}
						onClick={onPreviousPage}
					>
						Anterior
					</button>
					<span>
						{" "}
						Página {state.page} de {state.totalPages}{" "}
					</span>
					<button
						type="button"
						disabled={state.page >= state.totalPages}
						onClick={onNextPage}
					>
						Siguiente
					</button>
				</nav>
			</section>

			{state.editDraft !== null && (
				<div className="categories-modal-backdrop" role="presentation">
					<form
						className="categories-modal"
						aria-label="Editar categoría"
						aria-modal="true"
						role="dialog"
						onSubmit={onSubmitEdit}
					>
						<h2>
							{state.editDraft.id === null
								? "Agregar categoría"
								: "Editar categoría"}
						</h2>
						{state.errorMessage !== null && (
							<p className="categories-error" role="alert">
								{state.errorMessage}
							</p>
						)}
						<label className="auth-field" htmlFor="category-name">
							<span>Nombre</span>
							<input
								id="category-name"
								name="name"
								required
								value={state.editDraft.name}
								onChange={(event) => {
									onUpdateDraftField("name", getInputValue(event));
								}}
							/>
						</label>
						<fieldset className="categories-choice-group">
							<legend>Icono</legend>
							<div className="categories-icon-options">
								{CATEGORY_ICON_OPTIONS.map((option) => (
									<label
										className="categories-choice"
										key={option.value}
										aria-label={option.label}
									>
										<input
											checked={state.editDraft?.iconWeb === option.value}
											name="icon_web"
											type="radio"
											value={option.value}
											onChange={(event) => {
												onUpdateDraftField("iconWeb", getInputValue(event));
											}}
										/>
										<span
											className={`categories-icon-preview ${getColorClassName(state.editDraft?.colorWeb ?? "success")}`}
											aria-hidden="true"
										>
											{option.glyph}
										</span>
									</label>
								))}
							</div>
						</fieldset>
						<fieldset className="categories-choice-group">
							<legend>Color</legend>
							<div className="categories-color-options">
								{CATEGORY_COLOR_OPTIONS.map((option) => (
									<label
										className="categories-choice"
										key={option.value}
										aria-label={option.label}
									>
										<input
											checked={state.editDraft?.colorWeb === option.value}
											name="color_web"
											type="radio"
											value={option.value}
											onChange={(event) => {
												onUpdateDraftField("colorWeb", getInputValue(event));
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
						<div className="categories-modal-actions">
							<button type="button" onClick={onCancelEdit}>
								Cancelar
							</button>
							<button className="auth-submit-button" type="submit">
								{state.editDraft.id === null
									? "Crear categoría"
									: "Guardar cambios"}
							</button>
						</div>
					</form>
				</div>
			)}

			{state.deleteCandidate !== null && (
				<div className="categories-modal-backdrop" role="presentation">
					<section
						className="categories-modal"
						aria-label="Confirmar eliminación"
						aria-modal="true"
						role="dialog"
					>
						<h2>¿Eliminar {state.deleteCandidate.name}?</h2>
						<p>
							Esta acción elimina la categoría seleccionada después de
							confirmar.
						</p>
						{state.errorMessage !== null && (
							<p className="categories-error" role="alert">
								{state.errorMessage}
							</p>
						)}
						<div className="categories-modal-actions">
							<button type="button" onClick={onCancelDelete}>
								Cancelar
							</button>
							<button
								className="categories-danger-button"
								type="button"
								onClick={onConfirmDelete}
							>
								Sí, eliminar
							</button>
						</div>
					</section>
				</div>
			)}
		</main>
	);
}

/* v8 ignore start -- Hook-driven loading/mutation side effects are exercised through exported view and state helpers in the node test environment. */
export default function CategoriesScreen({
	autoLoad = true,
	initialState,
}: CategoriesScreenProps) {
	const { getToken } = useAuth();
	const [state, setState] = useState<CategoriesState>(() =>
		createCategoriesState(initialState ?? { status: "loading" }),
	);
	const [refreshKey, setRefreshKey] = useState(0);
	const categoryListRequest = useMemo(
		() => ({ limit: state.limit, page: state.page, refreshKey }),
		[refreshKey, state.limit, state.page],
	);
	const api = useMemo(
		() => createCategoriesApi({ getToken: () => getToken() }),
		[getToken],
	);

	useEffect(() => {
		if (!autoLoad) {
			return;
		}

		let ignore = false;
		async function loadCategories() {
			setState((current) => ({
				...current,
				status: "loading",
				errorMessage: null,
			}));
			try {
				const page = await api.listCategories({
					page: categoryListRequest.page,
					limit: categoryListRequest.limit,
				});
				if (!ignore) {
					setState((current) => ({
						...current,
						status: "success",
						categories: page.items,
						page: page.page,
						limit: page.limit,
						totalItems: page.totalItems,
						totalPages: page.totalPages,
					}));
				}
			} catch (error) {
				if (!ignore) {
					setState((current) => ({
						...current,
						status: "error",
						errorMessage:
							error instanceof Error
								? error.message
								: "No pudimos cargar las categorías.",
					}));
				}
			}
		}

		void loadCategories();

		return () => {
			ignore = true;
		};
	}, [api, autoLoad, categoryListRequest]);

	function changePage(nextPage: number) {
		setState((current) => ({ ...current, page: nextPage }));
	}

	function updateDraftField(field: keyof UpdateCategoryInput, value: string) {
		setState((current) => ({
			...current,
			editDraft:
				current.editDraft === null
					? null
					: { ...current.editDraft, [field]: value },
		}));
	}

	async function submitEdit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (state.editDraft === null) {
			return;
		}

		const { id, ...input } = state.editDraft;
		const payload = {
			...input,
			colorApk: input.colorApk || input.colorWeb,
			iconApk: input.iconApk || input.iconWeb,
		};
		try {
			if (id === null) {
				await api.createCategory(payload);
			} else {
				await api.updateCategory(id, payload);
			}
			setState((current) => ({
				...current,
				editDraft: null,
				errorMessage: null,
				successMessage:
					id === null ? "Categoría creada." : "Categoría actualizada.",
			}));
			setRefreshKey((current) => current + 1);
		} catch (error) {
			setState((current) => ({
				...current,
				successMessage: null,
				errorMessage:
					error instanceof Error
						? error.message
						: "No pudimos actualizar la categoría.",
			}));
		}
	}

	async function confirmDelete() {
		if (state.deleteCandidate === null) {
			return;
		}

		const deletedId = state.deleteCandidate.id;
		try {
			await api.deleteCategory(deletedId);
			setState((current) =>
				removeDeletedCategory({ ...current, errorMessage: null }, deletedId),
			);
		} catch (error) {
			setState((current) => ({
				...current,
				successMessage: null,
				errorMessage:
					error instanceof Error
						? error.message
						: "No pudimos eliminar la categoría.",
			}));
		}
	}

	return (
		<CategoriesView
			state={state}
			onPreviousPage={() => {
				changePage(state.page - 1);
			}}
			onNextPage={() => {
				changePage(state.page + 1);
			}}
			onOpenCreate={() => {
				setState((current) => openCreateModal(current));
			}}
			onOpenEdit={(id) => {
				setState((current) => openEditModal(current, id));
			}}
			onOpenDelete={(id) => {
				setState((current) => openDeleteConfirmation(current, id));
			}}
			onUpdateDraftField={updateDraftField}
			onSubmitEdit={(event) => {
				void submitEdit(event);
			}}
			onCancelEdit={() => {
				setState((current) => ({ ...current, editDraft: null }));
			}}
			onConfirmDelete={() => {
				void confirmDelete();
			}}
			onCancelDelete={() => {
				setState((current) => ({ ...current, deleteCandidate: null }));
			}}
		/>
	);
}
/* v8 ignore stop */
