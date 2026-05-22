"use client";

import {
	CATEGORY_COLOR_OPTIONS,
	type CategoryColor,
} from "./categories/categoryOptions";
import {
	DataTable,
	DataTableColumnHeader,
	type ColumnDef,
} from "./components/ui/data-table/data-table";

export { PAGE_SIZE_OPTIONS } from "./components/ui/data-table/data-table";

export interface HomeRecord {
	id: number;
	merchant: string;
	category: string;
	dueDate: string;
	amount: string;
	status: "Scheduled" | "Paid" | "Review" | "Overdue";
	color: CategoryColor;
}

interface HomeDashboardViewProps {
	records: HomeRecord[];
}

const merchantNames = [
	"Electricidad del Sur",
	"Internet Hogar",
	"Seguro familiar",
	"Agua metropolitana",
	"Gas residencial",
	"Streaming familiar",
	"Colegio Norte",
	"Telefonía móvil",
	"Expensas edificio",
	"Tarjeta principal",
];

const categories = [
	"Servicios",
	"Conectividad",
	"Protección",
	"Hogar",
	"Educación",
];

const statuses: HomeRecord["status"][] = [
	"Scheduled",
	"Paid",
	"Review",
	"Overdue",
];

export const MOCK_HOME_RECORDS: HomeRecord[] = Array.from(
	{ length: 50 },
	(_, index) => {
		const colorOption =
			CATEGORY_COLOR_OPTIONS[index % CATEGORY_COLOR_OPTIONS.length];
		const amount = 18_500 + index * 1350;

		return {
			id: index + 1,
			merchant: `${merchantNames[index % merchantNames.length]} ${index + 1}`,
			category: categories[index % categories.length],
			dueDate: `2026-06-${String((index % 28) + 1).padStart(2, "0")}`,
			amount: new Intl.NumberFormat("es-AR", {
				style: "currency",
				currency: "ARS",
				maximumFractionDigits: 0,
			}).format(amount),
			status: statuses[index % statuses.length],
			color: colorOption.value,
		};
	},
);

export function getPaginatedHomeRecords(
	records: HomeRecord[],
	page: number,
	pageSize: number,
) {
	const totalPages = Math.max(1, Math.ceil(records.length / pageSize));
	const safePage = Math.min(Math.max(page, 1), totalPages);
	const start = (safePage - 1) * pageSize;

	return {
		page: safePage,
		totalPages,
		records: records.slice(start, start + pageSize),
	};
}

const THEME_ACTION_COLOR_CLASSES: Record<CategoryColor, string> = {
	primary: "text-primary",
	secondary: "text-secondary",
	success: "text-secondary",
	danger: "text-destructive",
	warning: "text-warning",
	info: "text-primary",
	neutral: "text-border",
};

function ThemeActionButton({
	option,
}: {
	option: (typeof CATEGORY_COLOR_OPTIONS)[number];
}) {
	return (
		<button
			className={`grid min-h-20 cursor-pointer gap-1 rounded-2xl border border-[color-mix(in_srgb,currentColor_34%,var(--outline-variant))] bg-[color-mix(in_srgb,currentColor_12%,var(--surface-container-lowest))] p-[0.9rem] text-left font-extrabold transition-[border-color,box-shadow,transform] duration-150 hover:-translate-y-px hover:shadow-[0_0.75rem_1.75rem_var(--shadow)] focus-visible:-translate-y-px focus-visible:shadow-[0_0.75rem_1.75rem_var(--shadow)] ${THEME_ACTION_COLOR_CLASSES[option.value]}`}
			type="button"
		>
			<span>{option.label}</span>
			<small className="text-xs font-bold text-[var(--on-surface-variant)]">
				{option.value}
			</small>
		</button>
	);
}

const THEME_ACTION_BUTTONS = CATEGORY_COLOR_OPTIONS.map((option) => (
	<ThemeActionButton key={option.value} option={option} />
));

const CATEGORY_DOT_COLOR_CLASSES: Record<CategoryColor, string> = {
	primary: "text-primary",
	secondary: "text-secondary",
	success: "text-secondary",
	danger: "text-destructive",
	warning: "text-warning",
	info: "text-primary",
	neutral: "text-border",
};

const STATUS_CHIP_CLASSES: Record<HomeRecord["status"], string> = {
	Scheduled:
		"bg-[color-mix(in_srgb,var(--primary-container)_16%,transparent)] text-[var(--primary)]",
	Paid: "bg-[color-mix(in_srgb,var(--secondary-container)_42%,transparent)] text-[var(--secondary)]",
	Review: "bg-[color-mix(in_srgb,#f59e0b_18%,transparent)] text-[#b26a00]",
	Overdue:
		"bg-[color-mix(in_srgb,var(--error-container)_72%,transparent)] text-[var(--error)]",
};

const STATUS_LABELS: Record<HomeRecord["status"], string> = {
	Scheduled: "Programado",
	Paid: "Pagado",
	Review: "Revisar",
	Overdue: "Vencido",
};

export const HOME_PAYMENT_GRID_COLUMNS: ColumnDef<HomeRecord>[] = [
	{
		accessorKey: "merchant",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Comercio" />
		),
		cell: ({ row }) => (
			<>
				<span
					className={`mr-2 inline-block size-[0.65rem] rounded-full bg-current shadow-[0_0_0_4px_color-mix(in_srgb,currentColor_16%,transparent)] ${CATEGORY_DOT_COLOR_CLASSES[row.original.color]}`}
					aria-hidden="true"
				/>
				{row.original.merchant}
			</>
		),
	},
	{
		accessorKey: "category",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Categoría" />
		),
	},
	{
		accessorKey: "dueDate",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Vencimiento" />
		),
	},
	{
		accessorKey: "status",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Estado" />
		),
		cell: ({ row }) => (
			<span
				className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_CHIP_CLASSES[row.original.status]}`}
			>
				{STATUS_LABELS[row.original.status]}
			</span>
		),
	},
	{
		accessorKey: "amount",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Importe" />
		),
	},
];

export function HomeDashboardView({ records }: HomeDashboardViewProps) {
	return (
		<section
			className="mx-auto grid max-w-[1200px] grid-cols-[minmax(0,0.85fr)_minmax(0,1.55fr)] gap-6 pb-12 max-[880px]:grid-cols-1"
			aria-label="Vista previa del panel de pagos"
		>
			<article
				className="rounded-3xl border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-6"
				id="administración"
			>
				<div className="mb-6 flex items-start justify-between gap-4 max-[560px]:grid max-[560px]:grid-cols-1">
					<div>
						<p className="text-xs font-semibold leading-4 tracking-[0.08em] text-[var(--on-surface-variant)] uppercase">
							Administración
						</p>
						<h2 className="mt-2 font-['Manrope',Inter,ui-sans-serif,system-ui,sans-serif] text-[clamp(1.5rem,3vw,2rem)] leading-[1.15] tracking-[-0.02em]">
							Acciones por tema
						</h2>
					</div>
					<a
						className="inline-flex items-center justify-center rounded-full border border-[var(--outline-variant)] bg-transparent px-4 py-3 font-semibold text-[var(--on-surface)] transition-colors duration-150 hover:border-[var(--primary)] focus-visible:border-[var(--primary)] max-[560px]:w-full"
						href="#payment-grid"
					>
						Ver grilla
					</a>
				</div>

				<form
					className="grid grid-cols-[repeat(auto-fit,minmax(8.5rem,1fr))] gap-3 max-[560px]:grid-cols-1"
					aria-label="Acciones de color del tema"
				>
					{THEME_ACTION_BUTTONS}
				</form>
			</article>

			<DataTable
				id="payment-grid"
				eyebrow="Grilla de pagos"
				title="Pagos del hogar"
				data={records}
				columns={HOME_PAYMENT_GRID_COLUMNS}
				getRowId={(record) => record.id}
				searchColumnIds={["merchant", "category", "dueDate", "status", "amount"]}
				getSearchableRowValues={(record) => [STATUS_LABELS[record.status]]}
				searchPlaceholder="Buscar pagos..."
				totalSummary={(total) => `${total} registros`}
				paginationLabel="Paginación de la grilla de pagos"
			/>

			<article
				className="flex flex-col gap-4 rounded-3xl border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-6"
				id="contacto"
			>
				<p className="text-xs leading-4 font-semibold tracking-[0.08em] text-[var(--on-surface-variant)] uppercase">
					Contacto
				</p>
				<h2 className="mt-2 font-['Manrope',Inter,ui-sans-serif,system-ui,sans-serif] text-[clamp(1.5rem,3vw,2rem)] leading-[1.15] tracking-[-0.02em]">
					Base lista para crecer
				</h2>
				<p className="leading-normal text-[var(--on-surface-variant)]">
					La estructura combina acciones temáticas, una grilla realista y
					controles de paginación para incorporar próximos módulos sin
					reescribir el layout.
				</p>
			</article>
		</section>
	);
}

export default function HomeDashboard() {
	return <HomeDashboardView records={MOCK_HOME_RECORDS} />;
}
