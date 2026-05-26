import { describe, expect, it, vi } from "vitest";

import type { Category } from "./categoriesApi";
import { createCategoriesState, type CategoriesState } from "./categoriesState";
import { deleteCategory } from "./categoriesScreenDelete";
import { saveEdit } from "./categoriesScreenSave";
import type { CategoriesApi } from "./categoriesScreenTypes";

const category: Category = {
	colorApk: "primary",
	colorWeb: "primary",
	iconApk: "home",
	iconWeb: "home",
	id: 1,
	name: "Casa",
};

function createStateHarness(initialState: CategoriesState) {
	let state = initialState;
	const setState = vi.fn(
		(
			updater: CategoriesState | ((...args: [CategoriesState]) => CategoriesState),
		) => {
			state = typeof updater === "function" ? updater(state) : updater;
		},
	);

	return {
		getState: () => state,
		setState,
	};
}

describe("category mutation toasts", () => {
	it("shows a success toast after saving a category", async () => {
		const api = {
			createCategory: vi.fn().mockResolvedValue(category),
			updateCategory: vi.fn(),
		} as unknown as CategoriesApi;
		const refresh = vi.fn();
		const state = createStateHarness(
			createCategoriesState({
				status: "success",
				editDraft: { ...category, id: null, name: "Casa" },
			}),
		);
		const toasts = { error: vi.fn(), success: vi.fn() };

		await saveEdit(
			api,
			{ ...category, id: null, name: "Casa" },
			state.setState,
			refresh,
			toasts,
		);

		expect(toasts.success).toHaveBeenCalledWith("Categoría creada.");
		expect(toasts.error).not.toHaveBeenCalled();
		expect(state.getState().successMessage).toBeNull();
		expect(state.getState().errorMessage).toBeNull();
	});

	it("shows an error toast when saving fails", async () => {
		const api = {
			createCategory: vi.fn().mockRejectedValue(new Error("Servicio caído")),
			updateCategory: vi.fn(),
		} as unknown as CategoriesApi;
		const state = createStateHarness(
			createCategoriesState({ status: "success" }),
		);
		const toasts = { error: vi.fn(), success: vi.fn() };

		await saveEdit(
			api,
			{ ...category, id: null, name: "Casa" },
			state.setState,
			vi.fn(),
			toasts,
		);

		expect(toasts.error).toHaveBeenCalledWith("Servicio caído");
		expect(toasts.success).not.toHaveBeenCalled();
		expect(state.getState().errorMessage).toBeNull();
	});

	it("keeps inline save errors when toast callbacks are unavailable", async () => {
		const api = {
			createCategory: vi.fn().mockRejectedValue(new Error("Servicio caído")),
			updateCategory: vi.fn(),
		} as unknown as CategoriesApi;
		const state = createStateHarness(
			createCategoriesState({ status: "success" }),
		);

		await saveEdit(
			api,
			{ ...category, id: null, name: "Casa" },
			state.setState,
			vi.fn(),
		);

		expect(state.getState().errorMessage).toBe("Servicio caído");
	});

	it("shows success and error toasts when deleting categories", async () => {
		const successApi = {
			deleteCategory: vi.fn().mockResolvedValue(undefined),
		} as unknown as CategoriesApi;
		const successState = createStateHarness(
			createCategoriesState({ status: "success", categories: [category] }),
		);
		const successToasts = { error: vi.fn(), success: vi.fn() };

		await deleteCategory(
			successApi,
			category.id,
			successState.setState,
			successToasts,
		);

		expect(successToasts.success).toHaveBeenCalledWith("Categoría eliminada.");
		expect(successState.getState().categories).toEqual([]);
		expect(successState.getState().successMessage).toBeNull();

		const errorApi = {
			deleteCategory: vi.fn().mockRejectedValue(new Error("No se pudo borrar")),
		} as unknown as CategoriesApi;
		const errorState = createStateHarness(
			createCategoriesState({ status: "success" }),
		);
		const errorToasts = { error: vi.fn(), success: vi.fn() };

		await deleteCategory(
			errorApi,
			category.id,
			errorState.setState,
			errorToasts,
		);

		expect(errorToasts.error).toHaveBeenCalledWith("No se pudo borrar");
		expect(errorState.getState().errorMessage).toBeNull();
	});

	it("keeps inline delete errors when toast callbacks are unavailable", async () => {
		const api = {
			deleteCategory: vi.fn().mockRejectedValue(new Error("No se pudo borrar")),
		} as unknown as CategoriesApi;
		const state = createStateHarness(
			createCategoriesState({ status: "success" }),
		);

		await deleteCategory(api, category.id, state.setState);

		expect(state.getState().errorMessage).toBe("No se pudo borrar");
	});
});
