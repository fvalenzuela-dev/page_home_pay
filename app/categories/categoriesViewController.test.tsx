import { isValidElement, type ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";

import { renderCategoriesView } from "./categoriesViewController";
import { createCategoriesState } from "./categoriesState";

type ElementProps = Record<string, unknown>;

function asElement(node: unknown): ReactElement<ElementProps> {
	if (!isValidElement<ElementProps>(node)) {
		throw new Error("Expected a React element");
	}

	return node;
}

function callHandler(handler: unknown, event?: unknown) {
	if (typeof handler !== "function") {
		throw new Error("Expected a handler function");
	}

	Reflect.apply(handler, undefined, [event]);
}

describe("renderCategoriesView", () => {
	it("wires controller actions into category state updates", () => {
		const state = createCategoriesState({
			status: "success",
			categories: [
				{
					id: 7,
					name: "Agua",
					colorApk: "info",
					colorWeb: "info",
					iconApk: "water",
					iconWeb: "water",
				},
			],
			page: 2,
		});
		const setState = vi.fn();
		const passthroughHandlers = [vi.fn(), vi.fn(), vi.fn()] as const;
		const view = asElement(
			renderCategoriesView(state, setState, ...passthroughHandlers),
		);

		callHandler(view.props.onPreviousPage);
		callHandler(view.props.onNextPage);
		callHandler(view.props.onOpenCreate);
		callHandler(view.props.onOpenEdit, 7);
		callHandler(view.props.onOpenDelete, 7);
		callHandler(view.props.onCancelEdit);
		callHandler(view.props.onCancelDelete);
		callHandler(view.props.onUpdateDraftField, {
			field: "name",
			value: "Nueva",
		});
		callHandler(view.props.onSubmitEdit, { preventDefault: vi.fn() });
		callHandler(view.props.onConfirmDelete);

		expect(setState).toHaveBeenCalledTimes(7);
		expect(setState.mock.calls[0][0](state)).toEqual(
			expect.objectContaining({ page: 1 }),
		);
		expect(setState.mock.calls[1][0](state)).toEqual(
			expect.objectContaining({ page: 3 }),
		);
		expect(setState.mock.calls[2][0](state).editDraft).toEqual(
			expect.objectContaining({ id: null }),
		);
		expect(setState.mock.calls[3][0](state).editDraft).toEqual(
			expect.objectContaining({ id: 7 }),
		);
		expect(setState.mock.calls[4][0](state).deleteCandidate).toEqual(
			expect.objectContaining({ id: 7 }),
		);
		expect(setState.mock.calls[5][0](state).editDraft).toBeNull();
		expect(setState.mock.calls[6][0](state).deleteCandidate).toBeNull();
		expect(passthroughHandlers[0]).toHaveBeenCalledWith({
			field: "name",
			value: "Nueva",
		});
		expect(passthroughHandlers[1]).toHaveBeenCalledOnce();
		expect(passthroughHandlers[2]).toHaveBeenCalledOnce();
	});
});
