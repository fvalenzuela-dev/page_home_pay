import type { ReactNode } from "react";

type GlobalFilterChangeHandler = (...args: [string]) => void;

interface DataTableToolbarProps {
	globalFilter: string;
	onGlobalFilterChange: GlobalFilterChangeHandler;
	searchPlaceholder?: string;
	filters?: ReactNode;
	totalSummary?: ReactNode;
}

export function DataTableToolbar({
	globalFilter,
	onGlobalFilterChange,
	searchPlaceholder = "Buscar registros...",
	filters,
	totalSummary,
}: DataTableToolbarProps) {
	return (
		<div className="mb-4 flex flex-wrap items-end justify-between gap-3 max-[560px]:grid max-[560px]:grid-cols-1">
			<label className="grid min-w-56 flex-1 gap-1.5 text-[0.8rem] font-bold text-[var(--on-surface-variant)] max-[560px]:min-w-0">
				<span>Buscar</span>
				<input
					className="rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3.5 py-2.5 font-[inherit] text-[var(--on-surface)] outline-none transition-colors duration-150 placeholder:text-[var(--on-surface-variant)] focus:border-[var(--primary)]"
					placeholder={searchPlaceholder}
					type="search"
					value={globalFilter}
					onChange={(event) => {
						onGlobalFilterChange(event.target.value);
					}}
				/>
			</label>
			<div className="flex flex-wrap items-center justify-end gap-3 max-[560px]:justify-start">
				{filters ? <div className="flex flex-wrap gap-2">{filters}</div> : null}
				{totalSummary ? (
					<p className="rounded-full bg-[var(--surface-container-low)] px-3.5 py-2 text-sm font-bold text-[var(--on-surface-variant)]">
						{totalSummary}
					</p>
				) : null}
			</div>
		</div>
	);
}
