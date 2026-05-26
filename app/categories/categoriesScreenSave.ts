import { getErrorMessage } from "./categoriesScreenErrors";
import { createEditPayload } from "./categoriesScreenDraft";
import type {
	CategoriesApi,
	RefreshKeySetter,
	StateSetter,
} from "./categoriesScreenTypes";
import type { CategoriesState } from "./categoriesState";

interface ToastCallbacks {
	success: (...args: [string]) => void;
	error: (...args: [string]) => void;
}

export async function saveEdit(
	api: CategoriesApi,
	editDraft: NonNullable<CategoriesState["editDraft"]>,
	setState: StateSetter,
	setRefreshKey: RefreshKeySetter,
	toasts?: ToastCallbacks,
) {
	const { id, payload } = createEditPayload(editDraft);
	try {
		if (id === null) await api.createCategory(payload);
		else await api.updateCategory(id, payload);
		const message =
			id === null ? "Categoría creada." : "Categoría actualizada.";
		setState((current) => ({
			...current,
			editDraft: null,
			errorMessage: null,
			successMessage: null,
		}));
		toasts?.success(message);
		setRefreshKey((current) => current + 1);
	} catch (error) {
		const message = getErrorMessage(
			error,
			"No pudimos actualizar la categoría.",
		);
		setState((current) => ({
			...current,
			successMessage: null,
			errorMessage: toasts ? null : message,
		}));
		toasts?.error(message);
	}
}
