import { type Column } from "@tanstack/react-table";

interface DataTableColumnHeaderProps<TData, TValue> {
	column: Column<TData, TValue>;
	title: string;
}

export function DataTableColumnHeader<TData, TValue>({
	column,
	title,
}: DataTableColumnHeaderProps<TData, TValue>) {
	if (!column.getCanSort()) {
		return <span>{title}</span>;
	}

	const sortingState = column.getIsSorted();
	const sortingLabel =
		sortingState === "asc"
			? "ordenado ascendente"
			: sortingState === "desc"
				? "ordenado descendente"
				: "sin ordenar";

	return (
		<button
			className="inline-flex cursor-pointer items-center gap-1.5 rounded-full text-left font-bold text-[var(--on-surface-variant)] transition-colors duration-150 hover:text-[var(--on-surface)] focus-visible:text-[var(--on-surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
			type="button"
			onClick={() => {
				column.toggleSorting(sortingState === "asc");
			}}
		>
			<span>{title}</span>
			<span aria-hidden="true" className="text-[0.7rem]">
				{sortingState === "asc" ? "▲" : sortingState === "desc" ? "▼" : "↕"}
			</span>
			<span className="sr-only">{sortingLabel}</span>
		</button>
	);
}
