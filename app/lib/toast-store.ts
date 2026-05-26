import { create } from "zustand";

export type ToastVariant =
	| "primary"
	| "secondary"
	| "success"
	| "error"
	| "info"
	| "warning"
	| "neutral";
export type ToastPosition =
	| "top-right"
	| "top-left"
	| "bottom-right"
	| "bottom-left"
	| "top-center";

export type Toast = {
	id: string;
	message: string;
	variant: ToastVariant;
	title?: string;
	duration: number;
	position: ToastPosition;
	status: "visible" | "exiting";
};

export type ToastInput = {
	message: string;
	variant?: ToastVariant;
	title?: string;
	duration?: number;
	position?: ToastPosition;
};

type Timer = ReturnType<typeof setTimeout>;

type TimerKind = "auto" | "exit";

type ToastifyState = {
	toasts: Toast[];
	showToast: (_toast: ToastInput) => string;
	dismissToast: (_id: string) => void;
	clearToasts: () => void;
	success: (
		_message: string,
		_options?: Omit<ToastInput, "message" | "variant">,
	) => string;
	error: (
		_message: string,
		_options?: Omit<ToastInput, "message" | "variant">,
	) => string;
	info: (
		_message: string,
		_options?: Omit<ToastInput, "message" | "variant">,
	) => string;
	warning: (
		_message: string,
		_options?: Omit<ToastInput, "message" | "variant">,
	) => string;
};

export const DEFAULT_TOAST_DURATION = 3000;
export const DEFAULT_TOAST_POSITION: ToastPosition = "top-right";
export const TOAST_EXIT_DURATION = 180;

const timers = new Map<string, Partial<Record<TimerKind, Timer>>>();
let nextToastId = 0;

function createToastId() {
	nextToastId += 1;
	return `toast-${nextToastId}`;
}

function clearToastTimer(id: string, kind?: TimerKind) {
	const toastTimers = timers.get(id);
	if (toastTimers === undefined) return;

	if (kind !== undefined) {
		const timer = toastTimers[kind];
		if (timer !== undefined) clearTimeout(timer);
		delete toastTimers[kind];
		if (Object.keys(toastTimers).length === 0) timers.delete(id);
		return;
	}

	for (const timer of Object.values(toastTimers)) clearTimeout(timer);
	timers.delete(id);
}

function setToastTimer(id: string, kind: TimerKind, timer: Timer) {
	const toastTimers = timers.get(id) ?? {};
	toastTimers[kind] = timer;
	timers.set(id, toastTimers);
}

function scheduleDismiss(
	id: string,
	duration: number,
	dismissToast: (_id: string) => void,
) {
	if (!Number.isFinite(duration) || duration <= 0) return;

	const timer = setTimeout(() => {
		clearToastTimer(id, "auto");
		dismissToast(id);
	}, duration);
	setToastTimer(id, "auto", timer);
}

export const useToastifyStore = create<ToastifyState>((set, get) => ({
	toasts: [],
	showToast: (toast) => {
		const id = createToastId();
		const nextToast: Toast = {
			id,
			message: toast.message,
			variant: toast.variant ?? "info",
			title: toast.title,
			duration: toast.duration ?? DEFAULT_TOAST_DURATION,
			position: toast.position ?? DEFAULT_TOAST_POSITION,
			status: "visible",
		};

		set((state) => ({ toasts: [...state.toasts, nextToast] }));
		scheduleDismiss(id, nextToast.duration, get().dismissToast);

		return id;
	},
	dismissToast: (id) => {
		clearToastTimer(id, "auto");
		set((state) => ({
			toasts: state.toasts.map((toast) =>
				toast.id === id ? { ...toast, status: "exiting" } : toast,
			),
		}));
		const timer = setTimeout(() => {
			clearToastTimer(id, "exit");
			set((state) => ({
				toasts: state.toasts.filter((toast) => toast.id !== id),
			}));
		}, TOAST_EXIT_DURATION);
		setToastTimer(id, "exit", timer);
	},
	clearToasts: () => {
		for (const id of timers.keys()) clearToastTimer(id);
		set({ toasts: [] });
	},
	success: (message, options) =>
		get().showToast({ ...options, message, variant: "success" }),
	error: (message, options) =>
		get().showToast({ ...options, message, variant: "error" }),
	info: (message, options) =>
		get().showToast({ ...options, message, variant: "info" }),
	warning: (message, options) =>
		get().showToast({ ...options, message, variant: "warning" }),
}));

export function resetToastifyStoreForTests() {
	useToastifyStore.getState().clearToasts();
	nextToastId = 0;
}
