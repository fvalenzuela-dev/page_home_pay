import type { Table } from "@tanstack/react-table";

export const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

interface DataTablePaginationProps<TData> {
	table: Table<TData>;
	pageSizeOptions?: readonly number[];
	label?: string;
}

export function DataTablePagination<TData>({
	table,
	pageSizeOptions = PAGE_SIZE_OPTIONS,
	label = "Paginación de la tabla",
}: DataTablePaginationProps<TData>) {
	const page = table.getState().pagination.pageIndex + 1;
	const totalPages = Math.max(1, table.getPageCount());

	return (
		<nav
			className="flex flex-wrap items-center justify-between gap-3 pt-4 text-[var(--on-surface-variant)] max-[560px]:flex-col max-[560px]:items-stretch"
			aria-label={label}
		>
			<label className="grid gap-1.5 text-[0.8rem] font-bold text-[var(--on-surface-variant)] max-[560px]:w-full">
				<span>Filas por página</span>
				<select
					className="min-w-28 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3.5 py-2.5 pr-8 font-[inherit] text-[var(--on-surface)]"
					aria-label="Filas por página"
					value={table.getState().pagination.pageSize}
					onChange={(event) => {
						table.setPageSize(Number(event.target.value));
					}}
				>
					{pageSizeOptions.map((option) => (
						<option key={option} value={option}>
							{option}
						</option>
					))}
				</select>
			</label>

			<div className="flex flex-wrap items-center justify-end gap-3 max-[560px]:grid max-[560px]:grid-cols-1">
				<button
					className="cursor-pointer rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3.5 py-2.5 font-bold text-[var(--on-surface)] disabled:cursor-not-allowed disabled:opacity-55 max-[560px]:w-full"
					disabled={!table.getCanPreviousPage()}
					type="button"
					onClick={() => {
						table.previousPage();
					}}
				>
					Anterior
				</button>
				<span>
					Página {page} de {totalPages}
				</span>
				<button
					className="cursor-pointer rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3.5 py-2.5 font-bold text-[var(--on-surface)] disabled:cursor-not-allowed disabled:opacity-55 max-[560px]:w-full"
					disabled={!table.getCanNextPage()}
					type="button"
					onClick={() => {
						table.nextPage();
					}}
				>
					Siguiente
				</button>
			</div>
		</nav>
	);
}
