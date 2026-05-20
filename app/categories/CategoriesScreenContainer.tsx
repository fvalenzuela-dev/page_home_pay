"use client";

import { useAuth } from "@clerk/nextjs";
import {
	useEffect,
	useMemo,
	useState,
	type Dispatch,
	type FormEvent,
	type SetStateAction,
} from "react";

import { CategoriesView, type CategoriesViewProps } from "./CategoriesView";
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

export interface CategoriesScreenProps {
	autoLoad?: boolean;
	initialState?: PartialInitialState;
}

type CategoriesApi = ReturnType<typeof createCategoriesApi>;
type StateSetter = Dispatch<SetStateAction<CategoriesState>>;

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

function useCategoriesApi() {
	const { getToken } = useAuth();

	return useMemo(
		() => createCategoriesApi({ getToken: () => getToken() }),
		[getToken],
	);
}

function useCategoryLoader(
	api: CategoriesApi,
	autoLoad: boolean,
	state: CategoriesState,
	refreshKey: number,
	setState: StateSetter,
) {
	const request = useMemo(
		() => ({ limit: state.limit, page: state.page, refreshKey }),
		[refreshKey, state.limit, state.page],
	);

	useEffect(() => {
		if (!autoLoad) {
			return;
		}

		let ignore = false;
		void loadCategories(api, request, setState, () => ignore);

		return () => {
			ignore = true;
		};
	}, [api, autoLoad, request, setState]);
}

async function loadCategories(
	api: CategoriesApi,
	request: { page: number; limit: number },
	setState: StateSetter,
	shouldIgnore: () => boolean,
) {
	setState((current) => ({
		...current,
		status: "loading",
		errorMessage: null,
	}));
	try {
		const page = await api.listCategories(request);
		if (!shouldIgnore()) {
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
		if (!shouldIgnore()) {
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

async function saveEdit(
	api: CategoriesApi,
	editDraft: NonNullable<CategoriesState["editDraft"]>,
	setState: StateSetter,
	setRefreshKey: Dispatch<SetStateAction<number>>,
) {
	const { id, payload } = createEditPayload(editDraft);
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

async function deleteCategory(
	api: CategoriesApi,
	deletedId: number,
	setState: StateSetter,
) {
	try {
		await api.deleteCategory(deletedId);
		setState((current) =>
			removeDeletedCategory({ ...current, errorMessage: null }, deletedId),
		);
	} catch (error) {
		setState((current) => ({
			...current,
			successMessage: null,
			errorMessage: getErrorMessage(error, "No pudimos eliminar la categoría."),
		}));
	}
}

function renderCategoriesView(
	state: CategoriesState,
	setState: StateSetter,
	onUpdateDraftField: CategoriesViewProps["onUpdateDraftField"],
	onSubmitEdit: CategoriesViewProps["onSubmitEdit"],
	onConfirmDelete: CategoriesViewProps["onConfirmDelete"],
) {
	return (
		<CategoriesView
			state={state}
			onPreviousPage={() => {
				setState((current) => ({ ...current, page: state.page - 1 }));
			}}
			onNextPage={() => {
				setState((current) => ({ ...current, page: state.page + 1 }));
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
			onUpdateDraftField={onUpdateDraftField}
			onSubmitEdit={onSubmitEdit}
			onCancelEdit={() => {
				setState((current) => ({ ...current, editDraft: null }));
			}}
			onConfirmDelete={onConfirmDelete}
			onCancelDelete={() => {
				setState((current) => ({ ...current, deleteCandidate: null }));
			}}
		/>
	);
}

export default function CategoriesScreen({
	autoLoad = true,
	initialState,
}: CategoriesScreenProps) {
	const api = useCategoriesApi();
	const [state, setState] = useState<CategoriesState>(() =>
		createCategoriesState(initialState ?? { status: "loading" }),
	);
	const [refreshKey, setRefreshKey] = useState(0);
	useCategoryLoader(api, autoLoad, state, refreshKey, setState);

	function updateDraftField(field: keyof UpdateCategoryInput, value: string) {
		setState((current) => ({
			...current,
			editDraft:
				current.editDraft === null
					? null
					: { ...current.editDraft, [field]: value },
		}));
	}

	function submitEdit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (state.editDraft !== null) {
			void saveEdit(api, state.editDraft, setState, setRefreshKey);
		}
	}

	function confirmDelete() {
		if (state.deleteCandidate !== null) {
			void deleteCategory(api, state.deleteCandidate.id, setState);
		}
	}

	return renderCategoriesView(
		state,
		setState,
		updateDraftField,
		submitEdit,
		confirmDelete,
	);
}
