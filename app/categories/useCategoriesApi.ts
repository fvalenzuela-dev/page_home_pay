import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";

import { createCategoriesApi } from "./categoriesApi";

export function useCategoriesApi() {
	const { getToken } = useAuth();

	return useMemo(
		() => createCategoriesApi({ getToken: () => getToken() }),
		[getToken],
	);
}
