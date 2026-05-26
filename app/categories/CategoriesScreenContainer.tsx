"use client";

import { useState, type FormEvent } from "react";

import { useToastify } from "../hooks/use-toastify";

import { createCategoriesState, type CategoriesState } from "./categoriesState";
import {
	deleteCategory,
	saveEdit,
	updateDraft,
} from "./categoriesScreenMutations";
import type { CategoriesScreenProps } from "./categoriesScreenTypes";
import { renderCategoriesView } from "./categoriesViewController";
import { useCategoriesApi } from "./useCategoriesApi";
import { useCategoryLoader } from "./categoriesScreenLoader";

export type { CategoriesScreenProps } from "./categoriesScreenTypes";

export default function CategoriesScreen({
	autoLoad = true,
	initialState,
}: CategoriesScreenProps) {
	const api = useCategoriesApi();
	const toasts = useToastify();
	const [state, setState] = useState<CategoriesState>(() =>
		createCategoriesState(initialState ?? { status: "loading" }),
	);
	const [refreshKey, setRefreshKey] = useState(0);
	useCategoryLoader(api, autoLoad, state, refreshKey, setState);

	function submitEdit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (state.editDraft !== null) {
			void saveEdit(api, state.editDraft, setState, setRefreshKey, toasts);
		}
	}

	function confirmDelete() {
		if (state.deleteCandidate !== null) {
			void deleteCategory(api, state.deleteCandidate.id, setState, toasts);
		}
	}

	return renderCategoriesView(
		state,
		setState,
		({ field, value }) => {
			updateDraft(setState, field, value);
		},
		submitEdit,
		confirmDelete,
	);
}
