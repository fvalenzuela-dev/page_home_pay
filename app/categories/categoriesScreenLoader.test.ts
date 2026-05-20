import { beforeEach, describe, expect, it, vi } from "vitest";

const loadCategories = vi.hoisted(() => vi.fn());
const useEffect = vi.hoisted(() => vi.fn());
const useMemo = vi.hoisted(() => vi.fn());

vi.mock("react", async (importOriginal) => ({
	...(await importOriginal<typeof import("react")>()),
	useEffect,
	useMemo,
}));

vi.mock("./categoriesScreenLoad", () => ({ loadCategories }));

import { useCategoryLoader } from "./categoriesScreenLoader";
import type { CategoriesApi } from "./categoriesScreenTypes";
import { createCategoriesState } from "./categoriesState";

describe("useCategoryLoader", () => {
	beforeEach(() => {
		loadCategories.mockReset();
		useEffect.mockReset();
		useMemo.mockReset();
		useMemo.mockImplementation((factory: () => unknown) => factory());
		useEffect.mockImplementation((effect: () => unknown) => effect());
	});

	it("loads categories with the current page request", () => {
		const api = { listCategories: vi.fn() } as unknown as CategoriesApi;
		const setState = vi.fn();
		const state = createCategoriesState({
			status: "success",
			limit: 10,
			page: 3,
		});

		useCategoryLoader(api, true, state, 7, setState);

		expect(useMemo).toHaveBeenCalledOnce();
		expect(useEffect).toHaveBeenCalledOnce();
		expect(loadCategories).toHaveBeenCalledWith(
			api,
			{ limit: 10, page: 3, refreshKey: 7 },
			setState,
			expect.any(Function),
		);
		expect(loadCategories.mock.calls[0][3]()).toBe(false);
	});

	it("skips loading when auto load is disabled", () => {
		useCategoryLoader(
			{ listCategories: vi.fn() } as unknown as CategoriesApi,
			false,
			createCategoriesState({ status: "loading" }),
			0,
			vi.fn(),
		);

		expect(loadCategories).not.toHaveBeenCalled();
	});

	it("marks pending loads as ignored after cleanup", () => {
		const api = { listCategories: vi.fn() } as unknown as CategoriesApi;
		let cleanup: (() => void) | undefined;
		useEffect.mockImplementation((effect: () => unknown) => {
			cleanup = effect() as (() => void) | undefined;
		});

		useCategoryLoader(
			api,
			true,
			createCategoriesState({ status: "loading" }),
			0,
			vi.fn(),
		);
		cleanup?.();

		expect(loadCategories.mock.calls[0][3]()).toBe(true);
	});
});
