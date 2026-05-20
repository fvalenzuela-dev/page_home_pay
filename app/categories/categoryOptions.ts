export type CategoryIcon =
	| "car"
	| "home"
	| "electricity"
	| "water"
	| "gas"
	| "internet"
	| "phone"
	| "credit-card"
	| "insurance"
	| "health"
	| "education"
	| "subscription";

export type CategoryColor =
	| "primary"
	| "secondary"
	| "success"
	| "danger"
	| "warning"
	| "info"
	| "neutral";

export interface CategoryOption<TValue extends string> {
	value: TValue;
	label: string;
	glyph?: string;
}

export const CATEGORY_ICON_OPTIONS: CategoryOption<CategoryIcon>[] = [
	{ value: "car", label: "Auto", glyph: "🚗" },
	{ value: "home", label: "Casa", glyph: "🏠" },
	{ value: "electricity", label: "Electricidad", glyph: "⚡" },
	{ value: "water", label: "Agua", glyph: "💧" },
	{ value: "gas", label: "Gas", glyph: "🔥" },
	{ value: "internet", label: "Internet", glyph: "🌐" },
	{ value: "phone", label: "Teléfono", glyph: "☎" },
	{ value: "credit-card", label: "Credit card", glyph: "💳" },
	{ value: "insurance", label: "Seguro", glyph: "🛡" },
	{ value: "health", label: "Salud", glyph: "✚" },
	{ value: "education", label: "Educación", glyph: "🎓" },
	{ value: "subscription", label: "Suscripción", glyph: "↻" },
];

export const CATEGORY_COLOR_OPTIONS: CategoryOption<CategoryColor>[] = [
	{ value: "primary", label: "Primary" },
	{ value: "secondary", label: "Secondary" },
	{ value: "success", label: "Success" },
	{ value: "danger", label: "Danger" },
	{ value: "warning", label: "Warning" },
	{ value: "info", label: "Info" },
	{ value: "neutral", label: "Neutral/default" },
];

export function getCategoryIconLabel(icon: string): string {
	return (
		CATEGORY_ICON_OPTIONS.find((option) => option.value === icon)?.label ?? icon
	);
}

export function getCategoryIconGlyph(icon: string): string {
	return (
		CATEGORY_ICON_OPTIONS.find((option) => option.value === icon)?.glyph ?? "•"
	);
}

export function getCategoryColorLabel(color: string): string {
	return (
		CATEGORY_COLOR_OPTIONS.find((option) => option.value === color)?.label ??
		color
	);
}
