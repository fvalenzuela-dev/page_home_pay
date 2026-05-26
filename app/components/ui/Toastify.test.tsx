import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { ToastifyToast, ToastifyViewport } from "./Toastify";
import type { Toast } from "../../lib/toast-store";

const baseToast: Toast = {
	duration: 3000,
	id: "toast-1",
	message: "Categoría creada.",
	position: "top-right",
	status: "visible",
	variant: "success",
};

describe("Toastify", () => {
	it("renders accessible status toasts with success styling", () => {
		const markup = renderToStaticMarkup(
			<ToastifyToast toast={baseToast} dismissAction={vi.fn()} />,
		);

		expect(markup).toContain('role="status"');
		expect(markup).toContain('aria-live="polite"');
		expect(markup).toContain("Categoría creada.");
		expect(markup).toContain("bg-success");
		expect(markup).toContain("text-success-foreground");
		expect(markup).toContain("animate-toast-in");
		expect(markup).toContain('aria-label="Cerrar notificación"');
	});

	it("renders exiting toasts with exit animation", () => {
		const markup = renderToStaticMarkup(
			<ToastifyToast
				toast={{ ...baseToast, status: "exiting" }}
				dismissAction={vi.fn()}
			/>,
		);

		expect(markup).toContain("animate-toast-out");
		expect(markup).not.toContain("animate-toast-in");
	});

	it("renders distinct primary, info, and neutral toast colors", () => {
		const primaryMarkup = renderToStaticMarkup(
			<ToastifyToast
				toast={{ ...baseToast, variant: "primary" }}
				dismissAction={vi.fn()}
			/>,
		);
		const infoMarkup = renderToStaticMarkup(
			<ToastifyToast
				toast={{ ...baseToast, variant: "info" }}
				dismissAction={vi.fn()}
			/>,
		);
		const neutralMarkup = renderToStaticMarkup(
			<ToastifyToast
				toast={{ ...baseToast, variant: "neutral" }}
				dismissAction={vi.fn()}
			/>,
		);

		expect(primaryMarkup).toContain("bg-primary");
		expect(primaryMarkup).toContain("text-primary-foreground");
		expect(infoMarkup).toContain("bg-info");
		expect(infoMarkup).toContain("text-info-foreground");
		expect(neutralMarkup).toContain("bg-surface");
		expect(neutralMarkup).toContain("text-text");
	});

	it("renders error toasts as assertive alerts", () => {
		const markup = renderToStaticMarkup(
			<ToastifyToast
				toast={{ ...baseToast, message: "Falló", variant: "error" }}
				dismissAction={vi.fn()}
			/>,
		);

		expect(markup).toContain('role="alert"');
		expect(markup).toContain('aria-live="assertive"');
		expect(markup).toContain("bg-destructive");
		expect(markup).toContain("Falló");
	});

	it("groups stacked toasts by viewport position", () => {
		const markup = renderToStaticMarkup(
			<ToastifyViewport
				position="bottom-left"
				toasts={[
					{
						...baseToast,
						id: "toast-1",
						message: "Uno",
						position: "bottom-left",
					},
					{
						...baseToast,
						id: "toast-2",
						message: "Dos",
						position: "bottom-left",
						variant: "warning",
					},
				]}
				dismissAction={vi.fn()}
			/>,
		);

		expect(markup).toContain('aria-label="Notificaciones"');
		expect(markup).toContain("bottom-4");
		expect(markup).toContain("left-4");
		expect(markup).toContain("Uno");
		expect(markup).toContain("Dos");
		expect(markup).toContain("bg-warning");
	});
});
