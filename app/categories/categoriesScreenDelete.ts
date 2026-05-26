import { getErrorMessage } from "./categoriesScreenErrors";
import type { CategoriesApi, StateSetter } from "./categoriesScreenTypes";
import { removeDeletedCategory } from "./categoriesState";

interface ToastCallbacks {
	success: (...args: [string]) => void;
	error: (...args: [string]) => void;
}

export async function deleteCategory(
	api: CategoriesApi,
	deletedId: number,
	setState: StateSetter,
	toasts?: ToastCallbacks,
) {
	try {
		await api.deleteCategory(deletedId);
		setState((current) => ({
			...removeDeletedCategory({ ...current, errorMessage: null }, deletedId),
			successMessage: null,
		}));
		toasts?.success("Categoría eliminada.");
	} catch (error) {
		const message = getErrorMessage(error, "No pudimos eliminar la categoría.");
		setState((current) => ({
			...current,
			successMessage: null,
			errorMessage: toasts ? null : message,
		}));
		toasts?.error(message);
	}
}
