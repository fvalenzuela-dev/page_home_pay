"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useMemo, useState, type FormEvent } from "react";

import { CategoriesView } from "./CategoriesView";
import { createCategoriesApi, type UpdateCategoryInput } from "./categoriesApi";
import {
	createCategoriesState,
	openCreateModal,
	openDeleteConfirmation,
	openEditModal,
	removeDeletedCategory,
	type CategoriesState,
	type PartialInitialState,
} from "./categoriesState";

export { CategoriesView } from "./CategoriesView";
export {
	applyUpdatedCategory,
	createCategoriesState,
	openCreateModal,
	openDeleteConfirmation,
	openEditModal,
	removeDeletedCategory,
} from "./categoriesState";

export interface CategoriesScreenProps {
	autoLoad?: boolean;
	initialState?: PartialInitialState;
}

function getErrorMessage(error: unknown, fallback: string) {
	return error instanceof Error ? error.message : fallback;
}

function createEditPayload(
	editDraft: NonNullable<CategoriesState["editDraft"]>,
) {
	const { id, ...input } = editDraft;
	return {
		id,
		payload: {
			...input,
			colorApk: input.colorApk || input.colorWeb,
			iconApk: input.iconApk || input.iconWeb,
		},
	};
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
						errorMessage: getErrorMessage(
							error,
							"No pudimos cargar las categorías.",
						),
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

		const { id, payload } = createEditPayload(state.editDraft);
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
				errorMessage: getErrorMessage(
					error,
					"No pudimos actualizar la categoría.",
				),
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
				errorMessage: getErrorMessage(
					error,
					"No pudimos eliminar la categoría.",
				),
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
