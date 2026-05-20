import { getErrorMessage } from "./categoriesScreenErrors";
import type { CategoriesApi, StateSetter } from "./categoriesScreenTypes";
import { removeDeletedCategory } from "./categoriesState";

export async function deleteCategory(
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
