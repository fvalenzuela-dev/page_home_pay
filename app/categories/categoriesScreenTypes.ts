import type { Dispatch, SetStateAction } from "react";

import { createCategoriesApi } from "./categoriesApi";
import type { CategoriesState, PartialInitialState } from "./categoriesState";

export interface CategoriesScreenProps {
	autoLoad?: boolean;
	initialState?: PartialInitialState;
}

export type CategoriesApi = ReturnType<typeof createCategoriesApi>;
export type StateSetter = Dispatch<SetStateAction<CategoriesState>>;
export type RefreshKeySetter = Dispatch<SetStateAction<number>>;
