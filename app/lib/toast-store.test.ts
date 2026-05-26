import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
	DEFAULT_TOAST_DURATION,
	DEFAULT_TOAST_POSITION,
	TOAST_EXIT_DURATION,
	resetToastifyStoreForTests,
	useToastifyStore,
} from "./toast-store";

describe("toast store", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		resetToastifyStoreForTests();
	});

	afterEach(() => {
		resetToastifyStoreForTests();
		vi.useRealTimers();
	});

	it("adds toasts with defaults and returns a stable id", () => {
		const id = useToastifyStore.getState().success("Guardado");

		expect(id).toBe("toast-1");
		expect(useToastifyStore.getState().toasts).toEqual([
			expect.objectContaining({
				duration: DEFAULT_TOAST_DURATION,
				id,
				message: "Guardado",
				position: DEFAULT_TOAST_POSITION,
				variant: "success",
			}),
		]);
	});

	it("supports variants, custom duration, and manual dismissal", () => {
		const id = useToastifyStore
			.getState()
			.error("Falló", { duration: 7000, position: "bottom-left" });

		expect(useToastifyStore.getState().toasts[0]).toEqual(
			expect.objectContaining({
				duration: 7000,
				message: "Falló",
				position: "bottom-left",
				variant: "error",
			}),
		);

		useToastifyStore.getState().dismissToast(id);

		expect(useToastifyStore.getState().toasts).toEqual([
			expect.objectContaining({ id, status: "exiting" }),
		]);

		vi.advanceTimersByTime(TOAST_EXIT_DURATION);

		expect(useToastifyStore.getState().toasts).toEqual([]);
	});

	it("auto-dismisses toasts after their duration and exit animation", () => {
		useToastifyStore.getState().info("Procesando", { duration: 1200 });

		vi.advanceTimersByTime(1199);
		expect(useToastifyStore.getState().toasts).toHaveLength(1);

		vi.advanceTimersByTime(1);
		expect(useToastifyStore.getState().toasts).toEqual([
			expect.objectContaining({ status: "exiting" }),
		]);

		vi.advanceTimersByTime(TOAST_EXIT_DURATION);
		expect(useToastifyStore.getState().toasts).toEqual([]);
	});

	it("keeps persistent toasts when duration is zero", () => {
		useToastifyStore.getState().warning("Revisá los datos", { duration: 0 });

		vi.runAllTimers();

		expect(useToastifyStore.getState().toasts).toHaveLength(1);
	});
});
