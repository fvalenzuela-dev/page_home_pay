"use client";

import {
	type Toast,
	type ToastPosition,
	useToastifyStore,
} from "../../lib/toast-store";
import { cn } from "../../lib/utils";

function getToastPositionClasses(position: ToastPosition) {
	switch (position) {
		case "top-left":
			return "left-4 top-4 items-start";
		case "bottom-right":
			return "bottom-4 right-4 items-end";
		case "bottom-left":
			return "bottom-4 left-4 items-start";
		case "top-center":
			return "left-1/2 top-4 -translate-x-1/2 items-center";
		case "top-right":
			return "right-4 top-4 items-end";
	}
}

function getToastVariantClasses(variant: Toast["variant"]) {
	switch (variant) {
		case "primary":
			return "border-primary/35 bg-primary text-primary-foreground shadow-primary";
		case "secondary":
			return "border-secondary/70 bg-secondary text-secondary-foreground shadow-primary";
		case "success":
			return "border-success/35 bg-success text-success-foreground shadow-success";
		case "error":
			return "border-destructive/35 bg-destructive text-destructive-foreground shadow-destructive";
		case "warning":
			return "border-warning/35 bg-warning text-warning-foreground shadow-warning";
		case "neutral":
			return "border-border bg-surface text-text shadow-primary";
		case "info":
			return "border-info/35 bg-info text-info-foreground shadow-info";
	}
}

function getToastVariantLabel(variant: Toast["variant"]) {
	switch (variant) {
		case "primary":
			return "Primary";
		case "secondary":
			return "Secondary";
		case "success":
			return "Éxito";
		case "error":
			return "Error";
		case "warning":
			return "Advertencia";
		case "neutral":
			return "Neutral";
		case "info":
			return "Información";
	}
}

export function ToastifyToast({
	toast,
	dismissAction,
}: {
	toast: Toast;
	dismissAction: (_id: string) => void;
}) {
	const title = toast.title ?? getToastVariantLabel(toast.variant);
	const isError = toast.variant === "error";

	return (
		<li
			className={cn(
				"pointer-events-auto w-full max-w-sm rounded-2xl border px-4 py-3 text-sm font-semibold transition-[opacity,transform] duration-200",
				toast.status === "visible" && "animate-toast-in",
				toast.status === "exiting" && "animate-toast-out",
				getToastVariantClasses(toast.variant),
			)}
			role={isError ? "alert" : "status"}
			aria-live={isError ? "assertive" : "polite"}
		>
			<div className="flex items-start gap-3">
				<div className="min-w-0 flex-1">
					<p className="text-xs font-black uppercase tracking-[0.18em] opacity-80">
						{title}
					</p>
					<p className="mt-1 leading-6">{toast.message}</p>
				</div>
				<button
					className="rounded-full px-2 py-1 text-lg leading-none opacity-80 transition hover:bg-white/20 hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
					type="button"
					aria-label="Cerrar notificación"
					onClick={() => {
						dismissAction(toast.id);
					}}
				>
					×
				</button>
			</div>
		</li>
	);
}

export function ToastifyViewport({
	position,
	toasts,
	dismissAction,
}: {
	position: ToastPosition;
	toasts: Toast[];
	dismissAction: (_id: string) => void;
}) {
	if (toasts.length === 0) return null;

	return (
		<ol
			className={cn(
				"pointer-events-none fixed z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3",
				getToastPositionClasses(position),
			)}
			aria-label="Notificaciones"
		>
			{toasts.map((toast) => (
				<ToastifyToast
					key={toast.id}
					toast={toast}
					dismissAction={dismissAction}
				/>
			))}
		</ol>
	);
}

export default function Toastify() {
	const toasts = useToastifyStore((state) => state.toasts);
	const dismissToast = useToastifyStore((state) => state.dismissToast);
	const positions: ToastPosition[] = [
		"top-right",
		"top-left",
		"bottom-right",
		"bottom-left",
		"top-center",
	];

	return (
		<>
			{positions.map((position) => (
				<ToastifyViewport
					key={position}
					position={position}
					toasts={toasts.filter((toast) => toast.position === position)}
					dismissAction={dismissToast}
				/>
			))}
		</>
	);
}
