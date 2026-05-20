import { useEffect, useMemo } from "react";

import { loadCategories } from "./categoriesScreenLoad";
import type { CategoriesApi, StateSetter } from "./categoriesScreenTypes";
import type { CategoriesState } from "./categoriesState";

export function useCategoryLoader(
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
		if (!autoLoad) return;
		let ignore = false;
		void loadCategories(api, request, setState, () => ignore);
		return () => {
			ignore = true;
		};
	}, [api, autoLoad, request, setState]);
}
