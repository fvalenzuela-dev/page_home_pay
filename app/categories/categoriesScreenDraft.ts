import type { UpdateCategoryInput } from "./categoriesApi";
import type { StateSetter } from "./categoriesScreenTypes";
import type { CategoriesState } from "./categoriesState";

export function createEditPayload(
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

export function updateDraft(
	setState: StateSetter,
	field: keyof UpdateCategoryInput,
	value: string,
) {
	setState((current) => ({
		...current,
		editDraft:
			current.editDraft === null
				? null
				: { ...current.editDraft, [field]: value },
	}));
}
