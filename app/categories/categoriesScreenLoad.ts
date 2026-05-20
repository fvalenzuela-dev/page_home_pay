import { getErrorMessage } from "./categoriesScreenErrors";
import type { CategoriesApi, StateSetter } from "./categoriesScreenTypes";

export async function loadCategories(
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
		if (shouldIgnore()) return;
		setState((current) => ({
			...current,
			status: "success",
			categories: page.items,
			page: page.page,
			limit: page.limit,
			totalItems: page.totalItems,
			totalPages: page.totalPages,
		}));
	} catch (error) {
		if (shouldIgnore()) return;
		setState((current) => ({
			...current,
			status: "error",
			errorMessage: getErrorMessage(error, "No pudimos cargar las categorías."),
		}));
	}
}
