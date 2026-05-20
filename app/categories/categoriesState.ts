import type { ChangeEvent } from "react";

import { getCategoryIconGlyph } from "./categoryOptions";
import type { Category, UpdateCategoryInput } from "./categoriesApi";

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;

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

export type PartialInitialState = Partial<CategoriesState> & {
	status: CategoriesState["status"];
};

const DEFAULT_CATEGORIES_STATE: CategoriesState = {
	status: "loading",
	categories: [],
	page: DEFAULT_PAGE,
	limit: DEFAULT_LIMIT,
	totalItems: 0,
	totalPages: 1,
	errorMessage: null,
	successMessage: null,
	editDraft: null,
	deleteCandidate: null,
};

function withDefault<T>(value: T | undefined, fallback: T): T {
	return value === undefined ? fallback : value;
}

function getTotalItems(overrides: PartialInitialState): number {
	if (overrides.totalItems !== undefined) {
		return overrides.totalItems;
	}

	return overrides.categories?.length ?? DEFAULT_CATEGORIES_STATE.totalItems;
}

export function createCategoriesState(
	overrides: PartialInitialState = { status: "loading" },
): CategoriesState {
	const state = { ...DEFAULT_CATEGORIES_STATE, ...overrides };

	return {
		status: state.status,
		categories: withDefault(overrides.categories, state.categories),
		page: withDefault(overrides.page, state.page),
		limit: withDefault(overrides.limit, state.limit),
		totalItems: getTotalItems(overrides),
		totalPages: withDefault(overrides.totalPages, state.totalPages),
		errorMessage: withDefault(overrides.errorMessage, state.errorMessage),
		successMessage: withDefault(overrides.successMessage, state.successMessage),
		editDraft: withDefault(overrides.editDraft, state.editDraft),
		deleteCandidate: withDefault(
			overrides.deleteCandidate,
			state.deleteCandidate,
		),
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

export function getInputValue(event: ChangeEvent<HTMLInputElement>) {
	return event.target.value;
}

export function getColorClassName(color: string) {
	return `categories-color-${color}`;
}

export function getCategoryIconDisplay(category: Category) {
	const glyph = getCategoryIconGlyph(category.iconWeb);
	return {
		glyph: glyph === "•" ? "✓" : glyph,
		color: glyph === "•" ? "success" : category.colorWeb,
	};
}
