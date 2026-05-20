import { getErrorMessage } from "./categoriesScreenErrors";
import { createEditPayload } from "./categoriesScreenDraft";
import type {
	CategoriesApi,
	RefreshKeySetter,
	StateSetter,
} from "./categoriesScreenTypes";
import type { CategoriesState } from "./categoriesState";

export async function saveEdit(
	api: CategoriesApi,
	editDraft: NonNullable<CategoriesState["editDraft"]>,
	setState: StateSetter,
	setRefreshKey: RefreshKeySetter,
) {
	const { id, payload } = createEditPayload(editDraft);
	try {
		if (id === null) await api.createCategory(payload);
		else await api.updateCategory(id, payload);
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
