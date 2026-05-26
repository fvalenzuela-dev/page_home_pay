import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs", () => ({
	UserButton: () => <button type="button">Perfil</button>,
}));

import { CategoriesView } from "./CategoriesView";
import { createCategoriesState } from "./categoriesState";

describe("CategoriesView feedback", () => {
	it("does not render inline mutation success messages because Toastify owns them", () => {
		const markup = renderToStaticMarkup(
			<CategoriesView
				state={createCategoriesState({
					status: "success",
					categories: [],
					successMessage: "Categoría creada.",
				})}
				onCancelDelete={() => undefined}
				onCancelEdit={() => undefined}
				onConfirmDelete={() => undefined}
				onNextPage={() => undefined}
				onOpenCreate={() => undefined}
				onOpenDelete={() => undefined}
				onOpenEdit={() => undefined}
				onPageSizeChange={() => undefined}
				onPreviousPage={() => undefined}
				onSubmitEdit={() => undefined}
				onUpdateDraftField={() => undefined}
			/>,
		);

		expect(markup).not.toContain("Categoría creada.");
		expect(markup).toContain("Todavía no hay categorías.");
	});
});
